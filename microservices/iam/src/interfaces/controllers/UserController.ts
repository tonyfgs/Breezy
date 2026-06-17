import { Router } from 'express';
import { IController } from './IController';
import { LoginUseCase } from '../../application/usecases/LoginUseCase';
import { RegisterUseCase } from '../../application/usecases/RegisterUseCase';
import { verifyToken } from '../../infrastructure/utils/jwt.util';

export class UserController implements IController {
    public readonly path: string = '/auth/';
    public readonly router = Router();

    private loginUseCase: LoginUseCase;
    private registerUseCase: RegisterUseCase;

    constructor(loginUseCase: LoginUseCase, registerUseCase: RegisterUseCase) {
        this.loginUseCase = loginUseCase;
        this.registerUseCase = registerUseCase;
        this.initialiseRoutes();
    }

    private initialiseRoutes() {
        this.router.get('/health', (_req, res) => res.status(200).json({ service: 'auth', status: 'up' }));
        this.router.post('/login', this.login.bind(this));
        this.router.post('/register', this.register.bind(this));
        this.router.get('/validate', this.validate.bind(this));
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
