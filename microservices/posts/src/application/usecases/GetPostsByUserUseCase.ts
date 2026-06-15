import { IPostRepository } from '../../domain/repositories/IPostRepository';
import { PaginatedPostsDTO, toDTO } from '../dto/PostDTO';

export class GetPostsByUserUseCase {
    constructor(private readonly postRepository: IPostRepository) {}

    async execute(authorId: string, page: number, limit: number): Promise<PaginatedPostsDTO> {
        const { posts, total } = await this.postRepository.getPostsByUser(authorId, { page, limit });
        return {
            data: posts.map(toDTO),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
}
