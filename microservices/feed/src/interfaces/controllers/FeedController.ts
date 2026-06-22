import { Router } from 'express';
import type {IController} from "./IController";
import {GetFeedUseCase} from "../../application/usecases/GetFeedUseCase";
import {FeedDto} from "../../application/dto/FeedDto";
import {PostDTO} from "../../application/dto/PostDTO";
import { authenticate } from '../middlewares/authMiddleware';

export class FeedController implements IController {
    public readonly path = '/feed';
    public readonly router = Router();

    constructor(private readonly getFeedUseCase: GetFeedUseCase) {
        this.initialiseRoutes();
    }

    public initialiseRoutes(): void {
        this.router.get('/:idUser', authenticate, this.getFeed.bind(this));
    }

    private async getFeed(req: any, res: any): Promise<void> {
        try {
            if (req.user.id !== req.params.idUser && !['Admin', 'Moderateur'].includes(req.user.role)) {
                return res.status(403).json({ message: 'Forbidden - Cannot read feed of another user' });
            }
            const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
            const cursor = req.query.cursor as string | undefined;
            const { posts, nextCursor } = await this.getFeedUseCase.execute(req.params.idUser, limit, cursor);
            const feedDto = new FeedDto(
                posts.map(p => new PostDTO(p.id, p.authorId, p.content, p.likeCount, p.createdAt)),
                nextCursor,
            );
            res.status(200).json(feedDto);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }
}