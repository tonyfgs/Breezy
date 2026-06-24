import { Router } from 'express';
import { IController } from './IController';
import { GetModerationStatsUseCase } from '../../application/usecases/GetModerationStatsUseCase';
import { authenticate } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

export class StatsController implements IController {
    public readonly path = '/moderation';
    public readonly router = Router();

    constructor(private readonly getModerationStatsUseCase: GetModerationStatsUseCase) {
        this.initialiseRoutes();
    }

    private initialiseRoutes() {
        this.router.get('/stats', authenticate, requireRole(['moderator', 'admin']), this.getStats.bind(this));
    }

    private async getStats(_req: any, res: any): Promise<void> {
        try {
            const stats = await this.getModerationStatsUseCase.execute();
            res.status(200).json(stats);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }
}
