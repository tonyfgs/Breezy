import { ILikeRepository } from '../../domain/repositories/ILikeRepository';

export class GetLikeCountByPostUseCase {
    constructor(private readonly likeRepository: ILikeRepository) {}

    async execute(postId: string): Promise<{ postId: string; likeCount: number }> {
        const likeCount = await this.likeRepository.countLikesByPost(postId);
        return { postId, likeCount };
    }
}
