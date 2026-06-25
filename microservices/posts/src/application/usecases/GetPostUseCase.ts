import { IPostRepository } from '../../domain/repositories/IPostRepository';
import { ILikeRepository } from '../../domain/repositories/ILikeRepository';
import { PostWithStatsDTO } from '../dto/PostDTO';

export class GetPostUseCase {
    constructor(
        private readonly postRepository: IPostRepository,
        private readonly likeRepository: ILikeRepository,
    ) {}

    async execute(id: string): Promise<PostWithStatsDTO> {
        const post = await this.postRepository.getPost(id);
        const [likeCounts, commentCounts] = await Promise.all([
            this.likeRepository.countLikesByPosts([id]),
            this.postRepository.countCommentsByPosts([id]),
        ]);
        return {
            id: post.id!,
            authorId: post.authorId,
            content: post.content,
            parentPostId: post.parentPostId,
            likeCount: likeCounts.get(id) ?? 0,
            commentCount: commentCounts.get(id) ?? 0,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        };
    }
}
