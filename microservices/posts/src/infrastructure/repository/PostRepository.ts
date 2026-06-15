import { IPostRepository, PaginationParams } from '../../domain/repositories/IPostRepository';
import { Post } from '../../domain/entities/Post';
import { PostMapper } from '../mapper/postMapper';
import { PostModel } from '../models/PostModel';

export class PostRepository implements IPostRepository {
    async getAllPosts({ page, limit }: PaginationParams): Promise<{ posts: Post[]; total: number }> {
        const filter = { parentPostId: null };
        const [results, total] = await Promise.all([
            PostModel.find(filter).skip((page - 1) * limit).limit(limit),
            PostModel.countDocuments(filter),
        ]);
        return { posts: results.map(PostMapper.toDomain), total };
    }

    async getPost(id: string): Promise<Post> {
        const result = await PostModel.findById(id);
        if (!result) throw new Error(`Post not found: ${id}`);
        return PostMapper.toDomain(result);
    }

    async getComments(parentPostId: string): Promise<Post[]> {
        const results = await PostModel.find({ parentPostId });
        return results.map(PostMapper.toDomain);
    }

    async createPost(post: Post): Promise<Post> {
        const result = await PostModel.create(post);
        return PostMapper.toDomain(result);
    }

    async updatePost(id: string, post: Partial<Post>): Promise<Post> {
        const result = await PostModel.findByIdAndUpdate(
            id,
            { ...post, updatedAt: new Date() },
            { new: true }
        );
        if (!result) throw new Error(`Post not found: ${id}`);
        return PostMapper.toDomain(result);
    }

    async deletePost(id: string): Promise<void> {
        await PostModel.findByIdAndDelete(id);
    }
}
