import {IFollowRepository} from "../../domain/repositories/IFollowRepository";
import {FollowModel} from "../models/FollowModel";

export class FollowRepository implements IFollowRepository {

    /**
     * Retourne la liste des IDs des utilisateurs qui suivent `id`
     */
    async getFollowers(id: string): Promise<Array<string>> {
        const results = await FollowModel.find({ followingId: id });
        return results.map(f => f.follwerId);
    }

    /**
     * Retourne la liste des IDs des utilisateurs que `id` suit
     */
    async getFollowing(id: string): Promise<Array<string>> {
        const results = await FollowModel.find({ follwerId: id });
        return results.map(f => f.followingId);
    }

    /**
     * Crée un follow et retourne la liste mise à jour des following de `follwerId`
     */
    async createFollow(follwerId: string, followingId: string): Promise<Array<string>> {
        const existing = await FollowModel.findOne({ follwerId, followingId });
        if (!existing) {
            await FollowModel.create({ follwerId, followingId });
        }
        const results = await FollowModel.find({ follwerId });
        return results.map(f => f.followingId);
    }


    deleteFollow(follwerId: string, followingId: string): Promise<Array<string>> {
        throw new Error("Method not implemented.");
    }
}