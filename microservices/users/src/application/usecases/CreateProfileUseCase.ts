import {IProfileRepository} from "../../domain/repositories/IProfileRepository";
import {Profiler} from "node:inspector";
import {Profile} from "../../domain/entities/Profile";

export class CreateProfileUseCase {
    private readonly profileRepository: IProfileRepository;

    constructor(profileRepository: IProfileRepository) {
        this.profileRepository = profileRepository;
    }

    async execute(profile: Profile): Promise<Profile> {
        return this.profileRepository.createProfile(profile);
    }
}