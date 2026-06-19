import {IFollowRepository} from "../../domain/repositories/IFollowRepository";

export class GetFollowingUseCase {
    private readonly followRepository: IFollowRepository;

    constructor(followRepository: IFollowRepository) {
        this.followRepository = followRepository;
    }

    async execute(id: string): Promise<Array<string>> {
        return this.followRepository.getFollowing(id);
    }
}
