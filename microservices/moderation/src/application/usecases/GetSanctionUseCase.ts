import { ISanctionRepository } from '../../domain/repositories/ISanctionRepository';
import { SanctionDTO, toSanctionDTO } from '../dto/SanctionDTO';

export class GetSanctionUseCase {
    constructor(private readonly sanctionRepository: ISanctionRepository) {}

    async execute(id: string): Promise<SanctionDTO> {
        const sanction = await this.sanctionRepository.getSanction(id);
        return toSanctionDTO(sanction);
    }
}
