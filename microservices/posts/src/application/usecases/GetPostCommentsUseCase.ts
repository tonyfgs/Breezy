import { IPostRepository } from '../../domain/repositories/IPostRepository';
import { PostDTO, toDTO } from '../dto/PostDTO';

export class GetPostCommentsUseCase {
    constructor(private readonly postRepository: IPostRepository) {}

    async execute(parentPostId: string): Promise<PostDTO[]> {
        const comments = await this.postRepository.getComments(parentPostId);
        return comments.map(toDTO);
    }
}
