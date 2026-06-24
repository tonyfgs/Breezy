import { IPostRepository } from '../../domain/repositories/IPostRepository';

export class GetPostsStatsUseCase {
    constructor(private readonly postRepository: IPostRepository) {}

    async execute(): Promise<{ postsToday: number; totalPosts: number }> {
        const [postsToday, totalPosts] = await Promise.all([
            this.postRepository.countPostsToday(),
            this.postRepository.countAllPosts(),
        ]);
        return { postsToday, totalPosts };
    }
}
