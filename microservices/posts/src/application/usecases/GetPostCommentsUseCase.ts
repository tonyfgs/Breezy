import { IPostRepository } from '../../domain/repositories/IPostRepository';
import { ILikeRepository } from '../../domain/repositories/ILikeRepository';
import { PostWithStatsDTO } from '../dto/PostDTO';

export class GetPostCommentsUseCase {
    constructor(
        private readonly postRepository: IPostRepository,
        private readonly likeRepository: ILikeRepository,
    ) {}

    async execute(parentPostId: string, page: number, limit: number): Promise<{ data: PostWithStatsDTO[]; total: number; page: number; limit: number; totalPages: number }> {
        const { posts, total } = await this.postRepository.getComments(parentPostId, { page, limit });

        if (posts.length === 0) {
            return { data: [], total, page, limit, totalPages: 0 };
        }

        const postIds = posts.map(p => p.id!);
        const [likeCounts, commentCounts] = await Promise.all([
            this.likeRepository.countLikesByPosts(postIds),
            this.postRepository.countCommentsByPosts(postIds),
        ]);

        return {
            data: posts.map(p => ({
                id: p.id!,
                authorId: p.authorId,
                content: p.content,
                likeCount: likeCounts.get(p.id!) ?? 0,
                commentCount: commentCounts.get(p.id!) ?? 0,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
            })),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
}
