import { ILikeRepository } from '../../domain/repositories/ILikeRepository';

export class UnlikePostUseCase {
    constructor(private readonly likeRepository: ILikeRepository) {}

    async execute(postId: string, userId: string): Promise<void> {
        await this.likeRepository.deleteLike(postId, userId);
    }
}
