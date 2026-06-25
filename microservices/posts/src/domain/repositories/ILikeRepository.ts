import { Like } from '../entities/Like';
import { PaginationParams } from './IPostRepository';

export interface ILikeRepository {
    getLikesByPost(postId: string, pagination: PaginationParams): Promise<{ likes: Like[]; total: number }>;
    countLikesByPost(postId: string): Promise<number>;
    countLikesByPosts(postIds: string[]): Promise<Map<string, number>>;
    getLike(postId: string, userId: string): Promise<Like | null>;
    createLike(like: Like): Promise<Like>;
    deleteLike(postId: string, userId: string): Promise<void>;
}
