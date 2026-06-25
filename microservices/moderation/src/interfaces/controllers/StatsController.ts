import { Router } from 'express';
import { IController } from './IController';
import { GetModerationStatsUseCase } from '../../application/usecases/GetModerationStatsUseCase';
import { GetActiveUsersUseCase } from '../../application/usecases/GetActiveUsersUseCase';
import { authenticate } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { authenticateOrService } from '../middlewares/serviceMiddleware';

export class StatsController implements IController {
    public readonly path = '/moderation';
    public readonly router = Router();

    constructor(
        private readonly getModerationStatsUseCase: GetModerationStatsUseCase,
        private readonly getActiveUsersUseCase: GetActiveUsersUseCase,
    ) {
        this.initialiseRoutes();
    }

    private initialiseRoutes() {
        this.router.get('/stats', authenticate, requireRole(['moderator', 'admin']), this.getStats.bind(this));
        this.router.post('/users/active', authenticateOrService, this.getActiveUsers.bind(this));
    }

    private async getStats(_req: any, res: any): Promise<void> {
        try {
            const stats = await this.getModerationStatsUseCase.execute();
            res.status(200).json(stats);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    private async getActiveUsers(req: any, res: any): Promise<void> {
        try {
            const { userIds } = req.body;
            if (!Array.isArray(userIds)) return res.status(400).json({ message: 'userIds must be an array' });
            const activeIds = await this.getActiveUsersUseCase.execute(userIds);
            res.status(200).json(activeIds);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }
}
