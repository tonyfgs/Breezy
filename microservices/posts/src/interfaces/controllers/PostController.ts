import { Router } from 'express';
import { IController } from './IController';
import { CreatePostUseCase } from '../../application/usecases/CreatePostUseCase';
import { GetPostUseCase } from '../../application/usecases/GetPostUseCase';
import { GetAllPostsUseCase } from '../../application/usecases/GetAllPostsUseCase';
import { GetPostCommentsUseCase } from '../../application/usecases/GetPostCommentsUseCase';
import { GetPostsByUserUseCase } from '../../application/usecases/GetPostsByUserUseCase';
import { GetPostsByAuthorsUseCase } from '../../application/usecases/GetPostsByAuthorsUseCase';
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
        private readonly getPostsByUserUseCase: GetPostsByUserUseCase,
        private readonly updatePostUseCase: UpdatePostUseCase,
        private readonly deletePostUseCase: DeletePostUseCase,
        private readonly getPostsByAuthorsUseCase: GetPostsByAuthorsUseCase,
    ) {
        this.initialiseRoutes();
    }

    private initialiseRoutes() {
        this.router.get('/', this.getAllPosts.bind(this));
        this.router.get('/user/:userId', this.getPostsByUser.bind(this));
        this.router.get('/:id', this.getPost.bind(this));
        this.router.get('/:id/comments', this.getComments.bind(this));
        this.router.post('/by-authors', this.getPostsByAuthors.bind(this));
        this.router.post('/', this.createPost.bind(this));
        this.router.put('/:id', this.updatePost.bind(this));
        this.router.patch('/:id', this.patchPost.bind(this));
        this.router.delete('/:id', this.deletePost.bind(this));
    }

    private async getAllPosts(req: any, res: any): Promise<void> {
        try {
            const page = Math.max(1, parseInt(req.query.page) || 1);
            const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
            const result = await this.getAllPostsUseCase.execute(page, limit);
            res.status(200).json(result);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    private async getPostsByUser(req: any, res: any): Promise<void> {
        try {
            const page = Math.max(1, parseInt(req.query.page) || 1);
            const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
            const result = await this.getPostsByUserUseCase.execute(req.params.userId, page, limit);
            res.status(200).json(result);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    private async getPost(req: any, res: any): Promise<void> {
        try {
            const post = await this.getPostUseCase.execute(req.params.id);
            res.status(200).json(post);
        } catch (err: any) {
            res.status(404).json({ message: err.message });
        }
    }

    private async getComments(req: any, res: any): Promise<void> {
        try {
            const page = Math.max(1, parseInt(req.query.page) || 1);
            const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
            const result = await this.getPostCommentsUseCase.execute(req.params.id, page, limit);
            res.status(200).json(result);
        } catch (err: any) {
            res.status(404).json({ message: err.message });
        }
    }

    private async getPostsByAuthors(req: any, res: any): Promise<void> {
        try {
            const { authorIds, limit, cursor } = req.body;
            const parsedLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));
            const result = await this.getPostsByAuthorsUseCase.execute(authorIds, parsedLimit, cursor);
            res.status(200).json(result);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    private async createPost(req: any, res: any): Promise<void> {
        try {
            const post = await this.createPostUseCase.execute(req.body);
            res.status(201).json(post);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    private async updatePost(req: any, res: any): Promise<void> {
        try {
            const post = await this.updatePostUseCase.execute(req.params.id, req.body);
            res.status(200).json(post);
        } catch (err: any) {
            res.status(404).json({ message: err.message });
        }
    }

    private async patchPost(req: any, res: any): Promise<void> {
        try {
            const post = await this.updatePostUseCase.execute(req.params.id, req.body);
            res.status(200).json(post);
        } catch (err: any) {
            res.status(404).json({ message: err.message });
        }
    }

    private async deletePost(req: any, res: any): Promise<void> {
        try {
            await this.deletePostUseCase.execute(req.params.id);
            res.status(204).send();
        } catch (err: any) {
            res.status(404).json({ message: err.message });
        }
    }
}
