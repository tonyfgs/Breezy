import {IFollowRepository} from "../../domain/repositories/IFollowRepository";

export class CreateFollowUseCase {
    private readonly followRepository: IFollowRepository;

    constructor(followRepository: IFollowRepository) {
        this.followRepository = followRepository;
    }

    async execute(follwerId: string, followingId: string): Promise<Array<string>> {
        return this.followRepository.createFollow(follwerId, followingId);
    }
}
