import { IPostRepository } from '../../domain/repositories/IPostRepository';
import { UpdatePostDTO } from '../dto/UpdatePostDTO';
import { PostDTO, toDTO } from '../dto/PostDTO';

export class UpdatePostUseCase {
    constructor(private readonly postRepository: IPostRepository) {}

    async execute(id: string, data: UpdatePostDTO): Promise<PostDTO> {
        const updated = await this.postRepository.updatePost(id, data);
        return toDTO(updated);
    }
}
