import {IProfileRepository} from "../../domain/repositories/IProfileRepository";
import {ProfileDTO, toDTO} from "../dto/ProfileDTO";

export class GetProfileUseCase {
    private readonly repository: IProfileRepository;
    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }

    async execute(id: string): Promise<ProfileDTO> {
        const profile = await this.repository.getProfile(id);
        if (!profile) throw new Error(`Profile not found: ${id}`);
        return toDTO(profile);
    }
}