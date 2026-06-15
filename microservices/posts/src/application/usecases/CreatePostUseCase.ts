import { IPostRepository } from '../../domain/repositories/IPostRepository';
import { Post } from '../../domain/entities/Post';
import { CreatePostDTO } from '../dto/CreatePostDTO';
import { PostDTO, toDTO } from '../dto/PostDTO';

export class CreatePostUseCase {
    constructor(private readonly postRepository: IPostRepository) {}

    async execute(data: CreatePostDTO): Promise<PostDTO> {
        const post = new Post(
            data.authorId,
            data.content,
            data.parentPostId ?? null,
            data.tagsList ?? [],
            data.mediaList ?? [],
            data.mentionsList ?? []
        );
        const created = await this.postRepository.createPost(post);
        return toDTO(created);
    }
}
