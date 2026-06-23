import { Router } from 'express';
import { IController } from './IController';
import { CreateSanctionUseCase } from '../../application/usecases/CreateSanctionUseCase';
import { GetSanctionUseCase } from '../../application/usecases/GetSanctionUseCase';
import { GetAllSanctionsUseCase } from '../../application/usecases/GetAllSanctionsUseCase';
import { RevokeSanctionUseCase } from '../../application/usecases/RevokeSanctionUseCase';
import { authenticate } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

export class SanctionController implements IController {
    public readonly path = '/sanctions';
    public readonly router = Router();

    constructor(
        private readonly createSanctionUseCase: CreateSanctionUseCase,
        private readonly getSanctionUseCase: GetSanctionUseCase,
        private readonly getAllSanctionsUseCase: GetAllSanctionsUseCase,
        private readonly revokeSanctionUseCase: RevokeSanctionUseCase,
    ) {
        this.initialiseRoutes();
    }

    private initialiseRoutes() {
        this.router.post('/', authenticate, requireRole(['moderator', 'admin']), this.createSanction.bind(this));
        this.router.get('/', authenticate, requireRole(['moderator', 'admin']), this.getAllSanctions.bind(this));
        this.router.get('/:id', authenticate, requireRole(['moderator', 'admin']), this.getSanction.bind(this));
        this.router.delete('/:id', authenticate, requireRole(['moderator', 'admin']), this.revokeSanction.bind(this));
    }

    private async createSanction(req: any, res: any): Promise<void> {
        try {
            const sanction = await this.createSanctionUseCase.execute(req.body);
            if (!sanction) return res.status(409).json({ message: 'Active sanction already exists for this target' });
            res.status(201).json(sanction);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    private async getAllSanctions(req: any, res: any): Promise<void> {
        try {
            const filters = {
                targetId: req.query.targetId as string | undefined,
                targetType: req.query.targetType as string | undefined,
                fl_active: req.query.fl_active !== undefined ? parseInt(req.query.fl_active as string) : undefined,
            };
            const sanctions = await this.getAllSanctionsUseCase.execute(filters);
            res.status(200).json(sanctions);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    private async getSanction(req: any, res: any): Promise<void> {
        try {
            const sanction = await this.getSanctionUseCase.execute(req.params.id);
            res.status(200).json(sanction);
        } catch (err: any) {
            res.status(404).json({ message: err.message });
        }
    }

    private async revokeSanction(req: any, res: any): Promise<void> {
        try {
            const sanction = await this.revokeSanctionUseCase.execute(req.params.id);
            if (!sanction) return res.status(409).json({ message: 'Sanction is already revoked' });
            res.status(200).json(sanction);
        } catch (err: any) {
            res.status(404).json({ message: err.message });
        }
    }
}
