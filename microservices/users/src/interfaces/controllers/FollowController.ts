import {Router} from "express";
import {IController} from "./IController";
import {CreateFollowUseCase} from "../../application/usecases/CreateFollowUseCase";
import {GetFollowersUseCase} from "../../application/usecases/GetFollowersUseCase";
import {GetFollowingUseCase} from "../../application/usecases/GetFollowingUseCase";

export class FollowController implements IController {

    public readonly path: string = '/follows/';
    public readonly router: Router = Router();

    private createFollowUseCase: CreateFollowUseCase;
    private getFollowersUseCase: GetFollowersUseCase;
    private getFollowingUseCase: GetFollowingUseCase;

    constructor(
        createFollowUseCase: CreateFollowUseCase,
        getFollowersUseCase: GetFollowersUseCase,
        getFollowingUseCase: GetFollowingUseCase
    ) {
        this.createFollowUseCase = createFollowUseCase;
        this.getFollowersUseCase = getFollowersUseCase;
        this.getFollowingUseCase = getFollowingUseCase;
        this.initialiseRoutes();
    }

    private initialiseRoutes() {
        // POST /follows/          body: { follwerId, followingId }
        this.router.post(`/`, this.createFollow.bind(this));

        // GET /follows/:id/followers
        this.router.get(`/:id/followers`, this.getFollowers.bind(this));

        // GET /follows/:id/following
        this.router.get(`/:id/following`, this.getFollowing.bind(this));
    }

    private async createFollow(req: any, res: any): Promise<void> {
        const { follwerId, followingId } = req.body;
        if (!follwerId || !followingId) {
            res.status(400).json({ message: 'follwerId and followingId are required' });
            return;
        }
        const following = await this.createFollowUseCase.execute(follwerId, followingId);
        res.status(201).json(following);
    }

    private async getFollowers(req: any, res: any): Promise<void> {
        const id: string = req.params.id;
        const followers = await this.getFollowersUseCase.execute(id);
        res.status(200).json(followers);
    }

    private async getFollowing(req: any, res: any): Promise<void> {
        const id: string = req.params.id;
        const following = await this.getFollowingUseCase.execute(id);
        res.status(200).json(following);
    }
}
