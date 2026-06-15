import { ILikeRepository } from '../../domain/repositories/ILikeRepository';
import { PaginatedLikesDTO, toLikeDTO } from '../dto/LikeDTO';

export class GetLikesByPostUseCase {
    constructor(private readonly likeRepository: ILikeRepository) {}

    async execute(postId: string, page: number, limit: number): Promise<PaginatedLikesDTO> {
        const { likes, total } = await this.likeRepository.getLikesByPost(postId, { page, limit });
        return {
            data: likes.map(toLikeDTO),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
}
