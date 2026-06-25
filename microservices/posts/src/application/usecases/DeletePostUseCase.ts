import { IPostRepository } from '../../domain/repositories/IPostRepository';

export class DeletePostUseCase {
    constructor(private readonly postRepository: IPostRepository) {}

    async execute(id: string): Promise<void> {
        await this.postRepository.deletePost(id);
    }
}
