import { Like } from '../entities/Like';

export interface ILikeRepository {
    getLikesByPost(postId: string): Promise<Like[]>;
    getLike(postId: string, userId: string): Promise<Like | null>;
    createLike(like: Like): Promise<Like>;
    deleteLike(postId: string, userId: string): Promise<void>;
}
