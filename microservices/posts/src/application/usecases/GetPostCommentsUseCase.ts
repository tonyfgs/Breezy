import { IPostRepository } from '../../domain/repositories/IPostRepository';
import { PaginatedPostsDTO, toDTO } from '../dto/PostDTO';

export class GetPostCommentsUseCase {
    constructor(private readonly postRepository: IPostRepository) {}

    async execute(parentPostId: string, page: number, limit: number): Promise<PaginatedPostsDTO> {
        const { posts, total } = await this.postRepository.getComments(parentPostId, { page, limit });
        return {
            data: posts.map(toDTO),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
}
