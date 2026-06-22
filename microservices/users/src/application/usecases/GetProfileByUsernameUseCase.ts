import { IProfileRepository } from '../../domain/repositories/IProfileRepository';
import { ProfileDTO, toDTO } from '../dto/ProfileDTO';

export class GetProfileByUsernameUseCase {
    constructor(private readonly repository: IProfileRepository) {}

    async execute(username: string): Promise<ProfileDTO> {
        const profile = await this.repository.getByUsername(username);
        if (!profile) throw new Error(`Profile not found: ${username}`);
        return toDTO(profile);
    }
}
