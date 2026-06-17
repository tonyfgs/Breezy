import {IFollowRepository} from "../../domain/repositories/IFollowRepository";

export class GetFollowersUseCase {
    private readonly followRepository: IFollowRepository;

    constructor(followRepository: IFollowRepository) {
        this.followRepository = followRepository;
    }

    async execute(id: string): Promise<Array<string>> {
        return this.followRepository.getFollowers(id);
    }
}
