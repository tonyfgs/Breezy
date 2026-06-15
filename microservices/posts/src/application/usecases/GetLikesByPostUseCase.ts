import { ILikeRepository } from '../../domain/repositories/ILikeRepository';
import { LikeDTO, toLikeDTO } from '../dto/LikeDTO';

export class GetLikesByPostUseCase {
    constructor(private readonly likeRepository: ILikeRepository) {}

    async execute(postId: string): Promise<LikeDTO[]> {
        const likes = await this.likeRepository.getLikesByPost(postId);
        return likes.map(toLikeDTO);
    }
}
