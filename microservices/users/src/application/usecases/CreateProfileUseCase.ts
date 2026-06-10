import {IProfileRepository} from "../../domain/repositories/IProfileRepository";
import {Profiler} from "node:inspector";
import {Profile} from "../../domain/entities/Profile";
import {CreateProfileDTO} from "../dto/CreateProfileDTO";
import {ProfileDTO, toDTO} from "../dto/ProfileDTO";

export class CreateProfileUseCase {
    private readonly profileRepository: IProfileRepository;

    constructor(profileRepository: IProfileRepository) {
        this.profileRepository = profileRepository;
    }

    async execute(profile: CreateProfileDTO): Promise<ProfileDTO | null> {
        const profileExists = await this.profileRepository.getByUsername(profile.username);
        if (profileExists) return null;
        const newProfile = new Profile(profile.username, profile.bio, profile.avatar);
        const val = await this.profileRepository.createProfile(newProfile);
        return toDTO(val);
    }
}