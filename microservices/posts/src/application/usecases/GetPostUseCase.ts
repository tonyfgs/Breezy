import { IPostRepository } from '../../domain/repositories/IPostRepository';
import { PostDTO, toDTO } from '../dto/PostDTO';

export class GetPostUseCase {
    constructor(private readonly postRepository: IPostRepository) {}

    async execute(id: string): Promise<PostDTO> {
        const post = await this.postRepository.getPost(id);
        return toDTO(post);
    }
}
