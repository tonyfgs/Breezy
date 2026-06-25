import { ILikeRepository } from '../../domain/repositories/ILikeRepository';

export class GetLikeByUserUseCase {
    constructor(private readonly likeRepository: ILikeRepository) {}

    async execute(postId: string, userId: string): Promise<boolean> {
        const like = await this.likeRepository.getLike(postId, userId);
        return like !== null;
    }
}
