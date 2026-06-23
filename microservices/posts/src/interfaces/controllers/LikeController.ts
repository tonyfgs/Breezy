import { Router } from 'express';
import { IController } from './IController';
import { LikePostUseCase } from '../../application/usecases/LikePostUseCase';
import { UnlikePostUseCase } from '../../application/usecases/UnlikePostUseCase';
import { GetLikesByPostUseCase } from '../../application/usecases/GetLikesByPostUseCase';
import { GetLikeCountByPostUseCase } from '../../application/usecases/GetLikeCountByPostUseCase';
import { authenticate } from '../middlewares/authMiddleware';

export class LikeController implements IController {
    public readonly path = '/posts';
    public readonly router = Router();

    constructor(
        private readonly likePostUseCase: LikePostUseCase,
        private readonly unlikePostUseCase: UnlikePostUseCase,
        private readonly getLikesByPostUseCase: GetLikesByPostUseCase,
        private readonly getLikeCountByPostUseCase: GetLikeCountByPostUseCase,
    ) {
        this.initialiseRoutes();
    }

    private initialiseRoutes() {
        this.router.get('/:postId/likes/count', authenticate, this.getLikeCount.bind(this));
        this.router.get('/:postId/likes', authenticate, this.getLikes.bind(this));
        this.router.post('/:postId/likes', authenticate, this.likePost.bind(this));
        this.router.delete('/:postId/likes/:userId', authenticate, this.unlikePost.bind(this));
    }

    private async getLikeCount(req: any, res: any): Promise<void> {
        const result = await this.getLikeCountByPostUseCase.execute(req.params.postId);
        res.status(200).json(result);
    }

    private async getLikes(req: any, res: any): Promise<void> {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
        const result = await this.getLikesByPostUseCase.execute(req.params.postId, page, limit);
        res.status(200).json(result);
    }

    private async likePost(req: any, res: any): Promise<void> {
        req.body.userId = req.user.id; // Force to current user
        const { userId } = req.body;
        const like = await this.likePostUseCase.execute(req.params.postId, userId);
        if (!like) return res.status(409).json({ message: 'Already liked' });
        res.status(201).json(like);
    }

    private async unlikePost(req: any, res: any): Promise<void> {
        if (req.params.userId !== req.user.id && !['admin', 'moderator'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden - Cannot unlike for another user' });
        }
        await this.unlikePostUseCase.execute(req.params.postId, req.params.userId);
        res.status(204).send();
    }
}
