import { Router } from 'express';
import type {IController} from "./IController";
import {GetFeedUseCase} from "../../application/usecases/GetFeedUseCase";

export class FeedController implements IController {
    public readonly path = '/feed';
    public readonly router = Router();

    constructor(private readonly getFeedUseCase: GetFeedUseCase) {
        this.initialiseRoutes();
    }

    public initialiseRoutes(): void {
        this.router.get('/:idUser', this.getFeed.bind(this));
    }

    private async getFeed(req: any, res: any): Promise<void> {
        try {
            const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
            const cursor = req.query.cursor as string | undefined;
            const result = await this.getFeedUseCase.execute(req.params.idUser, limit, cursor);
            res.status(200).json(result);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }
}