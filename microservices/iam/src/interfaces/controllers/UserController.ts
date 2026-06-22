import { Router } from 'express';
import { IController } from './IController';
import { LoginUseCase } from '../../application/usecases/LoginUseCase';
import { RegisterUseCase } from '../../application/usecases/RegisterUseCase';
import { GetAllUsersUseCase } from '../../application/usecases/GetAllUsersUseCase';
import { DeleteUserUseCase } from '../../application/usecases/DeleteUserUseCase';
import { verifyToken } from '../../infrastructure/utils/jwt.util';
import { authenticate } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
export class UserController implements IController {
    public readonly path: string = '/auth/';
    public readonly router: Router = Router();

    private loginUseCase: LoginUseCase;
    private registerUseCase: RegisterUseCase;
    private getAllUsersUseCase: GetAllUsersUseCase;
    private deleteUserUseCase: DeleteUserUseCase;

    constructor(loginUseCase: LoginUseCase, registerUseCase: RegisterUseCase, getAllUsersUseCase: GetAllUsersUseCase, deleteUserUseCase: DeleteUserUseCase) {
        this.loginUseCase = loginUseCase;
        this.registerUseCase = registerUseCase;
        this.getAllUsersUseCase = getAllUsersUseCase;
        this.deleteUserUseCase = deleteUserUseCase;
        this.initialiseRoutes();
    }

    private initialiseRoutes() {
        this.router.get('/health', (_req, res) => res.status(200).json({ service: 'auth', status: 'up' }));
        this.router.get('/users', authenticate, requireRole(['Admin']), this.getAllUsers.bind(this));
        this.router.delete('/users/:username', authenticate, requireRole(['Admin']), this.deleteUser.bind(this));
        this.router.post('/login', this.login.bind(this));
        this.router.post('/register', this.register.bind(this));
        this.router.get('/validate', this.validate.bind(this));
    }

    private async getAllUsers(_req: any, res: any): Promise<void> {
        const users = await this.getAllUsersUseCase.execute();
        res.status(200).json(users);
    }

    private async deleteUser(req: any, res: any): Promise<void> {
        try {
            await this.deleteUserUseCase.execute(req.params.username);
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (err) {
            res.status(404).json({ message: (err as Error).message });
        }
    }

    private async login(req: any, res: any): Promise<void> {
        const result = await this.loginUseCase.execute(req.body);
        if (!result) return res.status(401).json({ message: 'Invalid credentials' });
        res.status(200).json(result);
    }

    private async register(req: any, res: any): Promise<void> {
        try {
            const result = await this.registerUseCase.execute(req.body);
            if (!result) return res.status(409).json({ message: 'Username already exists' });
            res.status(201).json(result);
        } catch (err) {
            res.status(400).json({ message: (err as Error).message });
        }
    }

    private async validate(req: any, res: any): Promise<void> {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        if (!decoded) return res.status(401).json({ message: 'Invalid token' });
        res.status(200).json({ message: 'Token is valid', user: decoded });
    }
}
