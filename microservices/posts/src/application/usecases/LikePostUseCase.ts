import { ILikeRepository } from '../../domain/repositories/ILikeRepository';
import { Like } from '../../domain/entities/Like';
import { LikeDTO, toLikeDTO } from '../dto/LikeDTO';

export class LikePostUseCase {
    constructor(private readonly likeRepository: ILikeRepository) {}

    async execute(postId: string, userId: string): Promise<LikeDTO | null> {
        const existing = await this.likeRepository.getLike(postId, userId);
        if (existing) return null;
        const like = new Like(postId, userId);
        const created = await this.likeRepository.createLike(like);
        return toLikeDTO(created);
    }
}
