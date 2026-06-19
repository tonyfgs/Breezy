import { Router } from 'express';
import type {IController} from "./IController";
import {GetPostUserUseCase} from "../../application/usecases/GetPostUserUseCase";

export class FeedController implements IController {
    public readonly path = '/feed';
    public readonly router = Router();
    private readonly getFeedUseCase: GetPostUserUseCase;

    constructor(getFeedUseCase: GetPostUserUseCase) {
        this.getFeedUseCase = getFeedUseCase;
        this.initialiseRoutes();
    }


    public initialiseRoutes(): void {
        this.router.get('/:idUser', this.getPostsUser.bind(this));
    }

    private async getPostsUser(req: any, res: any): Promise<void> {
        this.getFeedUseCase.execute(req.params.idUser);
    }



}