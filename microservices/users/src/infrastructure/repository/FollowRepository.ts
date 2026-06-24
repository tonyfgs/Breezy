import {IFollowRepository} from "../../domain/repositories/IFollowRepository";
import {FollowModel} from "../models/FollowModel";
import {ProfileModel} from "../models/ProfileModel";

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
        const followingIds = results.map(f => f.followingId);
        const activeProfils = await ProfileModel.find({ _id: { $in: followingIds }, fl_banned: { $ne: 1 } }, '_id');
        const activeIds = new Set(activeProfils.map(p => p._id.toString()));
        return followingIds.filter(id => activeIds.has(id));
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


    async deleteFollow(follwerId: string, followingId: string): Promise<Array<string>> {
        await FollowModel.findOneAndDelete({ follwerId, followingId });
        const results = await FollowModel.find({ follwerId });
        return results.map(f => f.followingId);
    }
}