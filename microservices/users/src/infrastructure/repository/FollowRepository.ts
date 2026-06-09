import {IFollowRepository} from "../../domain/repositories/IFollowRepository";

export class FollowRepository implements IFollowRepository{
    getFollowers(id: string): Promise<Array<string>> {
        throw new Error("Method not implemented.");
    }
    getFollowing(id: string): Promise<Array<string>> {
        throw new Error("Method not implemented.");
    }
    createFollow(follwerId: string, followingId: string): Promise<Array<string>> {
        throw new Error("Method not implemented.");
    }
    deleteFollow(follwerId: string, followingId: string): Promise<Array<string>> {
        throw new Error("Method not implemented.");
    }

}