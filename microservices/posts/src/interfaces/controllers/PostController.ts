import { Router } from 'express';
import { IController } from './IController';
import { CreatePostUseCase } from '../../application/usecases/CreatePostUseCase';
import { GetPostUseCase } from '../../application/usecases/GetPostUseCase';
import { GetAllPostsUseCase } from '../../application/usecases/GetAllPostsUseCase';
import { GetPostCommentsUseCase } from '../../application/usecases/GetPostCommentsUseCase';
import { UpdatePostUseCase } from '../../application/usecases/UpdatePostUseCase';
import { DeletePostUseCase } from '../../application/usecases/DeletePostUseCase';

export class PostController implements IController {
    public readonly path = '/posts';
    public readonly router = Router();

    constructor(
        private readonly createPostUseCase: CreatePostUseCase,
        private readonly getPostUseCase: GetPostUseCase,
        private readonly getAllPostsUseCase: GetAllPostsUseCase,
        private readonly getPostCommentsUseCase: GetPostCommentsUseCase,
        private readonly updatePostUseCase: UpdatePostUseCase,
        private readonly deletePostUseCase: DeletePostUseCase,
    ) {
        this.initialiseRoutes();
    }

    private initialiseRoutes() {
        this.router.get('/', this.getAllPosts.bind(this));
        this.router.get('/:id', this.getPost.bind(this));
        this.router.get('/:id/comments', this.getComments.bind(this));
        this.router.post('/', this.createPost.bind(this));
        this.router.put('/:id', this.updatePost.bind(this));
        this.router.delete('/:id', this.deletePost.bind(this));
    }

    private async getAllPosts(req: any, res: any): Promise<void> {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
        const result = await this.getAllPostsUseCase.execute(page, limit);
        res.status(200).json(result);
    }

    private async getPost(req: any, res: any): Promise<void> {
        const post = await this.getPostUseCase.execute(req.params.id);
        res.status(200).json(post);
    }

    private async getComments(req: any, res: any): Promise<void> {
        const comments = await this.getPostCommentsUseCase.execute(req.params.id);
        res.status(200).json(comments);
    }

    private async createPost(req: any, res: any): Promise<void> {
        const post = await this.createPostUseCase.execute(req.body);
        res.status(201).json(post);
    }

    private async updatePost(req: any, res: any): Promise<void> {
        const post = await this.updatePostUseCase.execute(req.params.id, req.body);
        res.status(200).json(post);
    }

    private async deletePost(req: any, res: any): Promise<void> {
        await this.deletePostUseCase.execute(req.params.id);
        res.status(204).send();
    }
}
