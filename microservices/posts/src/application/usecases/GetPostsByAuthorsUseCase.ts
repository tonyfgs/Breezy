import { IPostRepository } from '../../domain/repositories/IPostRepository';
import { ILikeRepository } from '../../domain/repositories/ILikeRepository';
import { PostWithStatsDTO } from '../dto/PostDTO';

export class GetPostsByAuthorsUseCase {
    constructor(
        private readonly repository: IPostRepository,
        private readonly likeRepository: ILikeRepository,
    ) {}

    async execute(authorIds: string[], limit: number, cursor?: string): Promise<{ posts: PostWithStatsDTO[]; nextCursor: string | null }> {
        const { posts, nextCursor } = await this.repository.getPostsByAuthors(authorIds, limit, cursor);

        if (posts.length === 0) return { posts: [], nextCursor };

        const postIds = posts.map(p => p.id!);
        const [likeCounts, commentCounts] = await Promise.all([
            this.likeRepository.countLikesByPosts(postIds),
            this.repository.countCommentsByPosts(postIds),
        ]);

        return {
            posts: posts.map(p => ({
                id: p.id!,
                authorId: p.authorId,
                content: p.content,
                likeCount: likeCounts.get(p.id!) ?? 0,
                commentCount: commentCounts.get(p.id!) ?? 0,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
            })),
            nextCursor,
        };
    }
}
