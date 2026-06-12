import {IProfileRepository} from "../../domain/repositories/IProfileRepository";
import {ProfileDTO, toDTO} from "../dto/ProfileDTO";

export class GetAllProfilesUseCase {
    private readonly repository: IProfileRepository;
    
    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }

    async execute(): Promise<ProfileDTO[]> {
        const profiles = await this.repository.getAllProfiles();
        return profiles.map(toDTO);
    }
}
