import { PostEntity } from "../../../domain/entities/PostEntity";
import {IPostGateway} from "../../../domain/gateway/IPostGateway";

export class MockPostsGateway implements IPostGateway {


    async getPostsByAuthorsIds(userId: string[], limit: number, cursor?: string): Promise<{ posts: PostEntity[]; nextCursor?: string }> {
        const mockPosts: PostEntity[] = [
            {
                id: 'post-1',
                authorId: 'user-1',
                content: 'Contenu du post 1',
                likeCount: 10,
                commentCount: 0,
                createdAt: new Date('2023-10-01'),
                updatedAt: new Date('2023-10-01'),
            },
            {
                id: 'post-2',
                authorId: 'user-2',
                content: 'Contenu du post 2',
                likeCount: 5,
                commentCount: 0,
                createdAt: new Date('2023-09-30'),
                updatedAt: new Date('2023-09-30'),
            },
            {
                id: 'post-3',
                authorId: 'user-1',
                content: 'Contenu du post 3',
                likeCount: 15,
                commentCount: 0,
                createdAt: new Date('2023-09-28'),
                updatedAt: new Date('2023-09-28'),
            },
        ];

        let filtered = mockPosts.filter(post => userId.includes(post.authorId));
        if (cursor) {
            filtered = filtered.filter(post => post.createdAt < new Date(cursor));
        }
        const posts = filtered.slice(0, limit);
        const nextCursor = posts.length === limit ? posts[posts.length - 1].createdAt.toISOString() : undefined;
        return { posts, nextCursor };
    }

}