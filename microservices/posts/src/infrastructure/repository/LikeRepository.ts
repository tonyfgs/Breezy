import mongoose from 'mongoose';
import { ILikeRepository } from '../../domain/repositories/ILikeRepository';
import { PaginationParams } from '../../domain/repositories/IPostRepository';
import { Like } from '../../domain/entities/Like';
import { LikeMapper } from '../mapper/likeMapper';
import { LikeModel } from '../models/LikeModel';

export class LikeRepository implements ILikeRepository {
    async getLikesByPost(postId: string, { page, limit }: PaginationParams): Promise<{ likes: Like[]; total: number }> {
        const filter = { postId };
        const [results, total] = await Promise.all([
            LikeModel.find(filter).skip((page - 1) * limit).limit(limit),
            LikeModel.countDocuments(filter),
        ]);
        return { likes: results.map(LikeMapper.toDomain), total };
    }

    async countLikesByPost(postId: string): Promise<number> {
        return LikeModel.countDocuments({ postId });
    }

    async countLikesByPosts(postIds: string[]): Promise<Map<string, number>> {
        const objectIds = postIds.map(id => new mongoose.Types.ObjectId(id));
        const results = await LikeModel.aggregate([
            { $match: { postId: { $in: objectIds } } },
            { $group: { _id: '$postId', count: { $sum: 1 } } },
        ]);
        return new Map(results.map((r: any) => [r._id.toString(), r.count]));
    }

    async getLike(postId: string, userId: string): Promise<Like | null> {
        const result = await LikeModel.findOne({ postId, userId });
        if (!result) return null;
        return LikeMapper.toDomain(result);
    }

    async createLike(like: Like): Promise<Like> {
        const result = await LikeModel.create(like);
        return LikeMapper.toDomain(result);
    }

    async deleteLike(postId: string, userId: string): Promise<void> {
        await LikeModel.findOneAndDelete({ postId, userId });
    }
}
