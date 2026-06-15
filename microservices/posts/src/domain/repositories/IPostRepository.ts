import { Post } from '../entities/Post';

export interface PaginationParams {
    page: number;
    limit: number;
}

export interface IPostRepository {
    getAllPosts(pagination: PaginationParams): Promise<{ posts: Post[]; total: number }>;
    getPost(id: string): Promise<Post>;
    getComments(parentPostId: string): Promise<Post[]>;
    createPost(post: Post): Promise<Post>;
    updatePost(id: string, post: Partial<Post>): Promise<Post>;
    deletePost(id: string): Promise<void>;
}
