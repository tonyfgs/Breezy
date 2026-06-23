import mongoose from 'mongoose';
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

    async getPostsByUser(authorId: string, { page, limit }: PaginationParams): Promise<{ posts: Post[]; total: number }> {
        const filter = { authorId };
        const [results, total] = await Promise.all([
            PostModel.find(filter).skip((page - 1) * limit).limit(limit),
            PostModel.countDocuments(filter),
        ]);
        return { posts: results.map(PostMapper.toDomain), total };
    }

    async getComments(parentPostId: string, { page, limit }: PaginationParams): Promise<{ posts: Post[]; total: number }> {
        const filter = { parentPostId };
        const [results, total] = await Promise.all([
            PostModel.find(filter).skip((page - 1) * limit).limit(limit),
            PostModel.countDocuments(filter),
        ]);
        return { posts: results.map(PostMapper.toDomain), total };
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

    async getPostsByAuthors(authorIds: string[], limit: number, cursor?: string): Promise<{ posts: Post[]; nextCursor: string | null }> {
        const filter: Record<string, any> = { authorId: { $in: authorIds }, parentPostId: null };
        if (cursor) {
            filter.createdAt = { $lt: new Date(cursor) };
        }
        const results = await PostModel.find(filter).sort({ createdAt: -1 }).limit(limit);
        const posts = results.map(PostMapper.toDomain);
        const nextCursor = posts.length === limit ? posts[posts.length - 1].createdAt.toISOString() : null;
        return { posts, nextCursor };
    }

    async countCommentsByPosts(postIds: string[]): Promise<Map<string, number>> {
        const objectIds = postIds.map(id => new mongoose.Types.ObjectId(id));
        const results = await PostModel.aggregate([
            { $match: { parentPostId: { $in: objectIds } } },
            { $group: { _id: '$parentPostId', count: { $sum: 1 } } },
        ]);
        return new Map(results.map((r: any) => [r._id.toString(), r.count]));
    }

    async deletePost(id: string): Promise<void> {
        await PostModel.findByIdAndDelete(id);
    }
}
