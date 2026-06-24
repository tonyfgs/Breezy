import mongoose from 'mongoose';
import app from './app';
import 'dotenv/config';
import { IController } from './interfaces/controllers/IController';
import { PostRepository } from './infrastructure/repository/PostRepository';
import { LikeRepository } from './infrastructure/repository/LikeRepository';
import { CreatePostUseCase } from './application/usecases/CreatePostUseCase';
import { GetPostUseCase } from './application/usecases/GetPostUseCase';
import { GetAllPostsUseCase } from './application/usecases/GetAllPostsUseCase';
import { GetPostCommentsUseCase } from './application/usecases/GetPostCommentsUseCase';
import { UpdatePostUseCase } from './application/usecases/UpdatePostUseCase';
import { DeletePostUseCase } from './application/usecases/DeletePostUseCase';
import { LikePostUseCase } from './application/usecases/LikePostUseCase';
import { UnlikePostUseCase } from './application/usecases/UnlikePostUseCase';
import { GetLikesByPostUseCase } from './application/usecases/GetLikesByPostUseCase';
import { GetLikeCountByPostUseCase } from './application/usecases/GetLikeCountByPostUseCase';
import { GetLikeByUserUseCase } from './application/usecases/GetLikeByUserUseCase';
import { GetPostsByUserUseCase } from './application/usecases/GetPostsByUserUseCase';
import { GetPostsByAuthorsUseCase } from './application/usecases/GetPostsByAuthorsUseCase';
import { PostController } from './interfaces/controllers/PostController';
import { LikeController } from './interfaces/controllers/LikeController';

const PORT = process.env.PORT || 4003;
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI === undefined)
    throw new Error('MONGODB_URI is not defined');

const controllerTable = new Array<IController>();

const postRepository = new PostRepository();
const likeRepository = new LikeRepository();

const postController = new PostController(
    new CreatePostUseCase(postRepository),
    new GetPostUseCase(postRepository, likeRepository),
    new GetAllPostsUseCase(postRepository),
    new GetPostCommentsUseCase(postRepository, likeRepository),
    new GetPostsByUserUseCase(postRepository, likeRepository),
    new UpdatePostUseCase(postRepository),
    new DeletePostUseCase(postRepository),
    new GetPostsByAuthorsUseCase(postRepository, likeRepository),
);

const likeController = new LikeController(
    new LikePostUseCase(likeRepository),
    new UnlikePostUseCase(likeRepository),
    new GetLikesByPostUseCase(likeRepository),
    new GetLikeCountByPostUseCase(likeRepository),
    new GetLikeByUserUseCase(likeRepository),
);

controllerTable.push(postController, likeController);

for (const controller of controllerTable) {
    app.use(controller.path, controller.router);
}

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1);
    });
