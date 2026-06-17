import { ISanctionRepository, SanctionFilters } from '../../domain/repositories/ISanctionRepository';
import { SanctionDTO, toSanctionDTO } from '../dto/SanctionDTO';

export class GetAllSanctionsUseCase {
    constructor(private readonly sanctionRepository: ISanctionRepository) {}

    async execute(filters: SanctionFilters): Promise<SanctionDTO[]> {
        const sanctions = await this.sanctionRepository.getAllSanctions(filters);
        return sanctions.map(toSanctionDTO);
    }
}
