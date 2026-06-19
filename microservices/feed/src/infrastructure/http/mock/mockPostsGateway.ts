import { PostEntity } from "../../../domain/entities/PostEntity";
import {IPostGateway} from "../../../domain/gateway/IPostGateway";

export class MockPostsGateway implements IPostGateway {


    async getPostsByAuthorsIds(userId: Array<string>): Promise<Array<PostEntity>> {
        const mockPosts: PostEntity[] = [
            {
                id: 'post-1',
                authorId: 'user-1',
                content: 'Contenu du post 1',
                likeCount: 10,
                createdAt: new Date('2023-10-01'),
                updatedAt: new Date('2023-10-01'),
            },
            {
                id: 'post-2',
                authorId: 'user-2',
                content: 'Contenu du post 2',
                likeCount: 5,
                createdAt: new Date('2023-09-30'),
                updatedAt: new Date('2023-09-30'),
            },
            {
                id: 'post-3',
                authorId: 'user-1',
                content: 'Contenu du post 3',
                likeCount: 15,
                createdAt: new Date('2023-09-28'),
                updatedAt: new Date('2023-09-28'),
            },
        ];

        return mockPosts.filter(post => userId.includes(post.authorId));
    }

}