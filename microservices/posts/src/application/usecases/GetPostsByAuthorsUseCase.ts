import { IPostRepository } from '../../domain/repositories/IPostRepository';
import { Post } from '../../domain/entities/Post';

export class GetPostsByAuthorsUseCase {
    constructor(private readonly repository: IPostRepository) {}

    async execute(authorIds: string[], limit: number, cursor?: string): Promise<{ posts: Post[]; nextCursor: string | null }> {
        return this.repository.getPostsByAuthors(authorIds, limit, cursor);
    }
}
