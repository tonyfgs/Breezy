import { ILikeRepository } from '../../domain/repositories/ILikeRepository';
import { Like } from '../../domain/entities/Like';
import { LikeMapper } from '../mapper/likeMapper';
import { LikeModel } from '../models/LikeModel';

export class LikeRepository implements ILikeRepository {
    async getLikesByPost(postId: string): Promise<Like[]> {
        const results = await LikeModel.find({ postId });
        return results.map(LikeMapper.toDomain);
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
