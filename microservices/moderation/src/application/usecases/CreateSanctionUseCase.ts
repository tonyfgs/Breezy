import { ISanctionRepository } from '../../domain/repositories/ISanctionRepository';
import { BanService } from '../../infrastructure/services/BanService';
import { Sanction } from '../../domain/entities/Sanction';
import { CreateSanctionDTO } from '../dto/CreateSanctionDTO';
import { SanctionDTO, toSanctionDTO } from '../dto/SanctionDTO';

export class CreateSanctionUseCase {
    constructor(
        private readonly sanctionRepository: ISanctionRepository,
        private readonly banService: BanService,
    ) {}

    async execute(data: CreateSanctionDTO): Promise<SanctionDTO | null> {
        const existing = await this.sanctionRepository.getActiveSanctionByTarget(data.targetId);
        if (existing) return null;

        const sanction = new Sanction(
            data.targetId,
            data.targetType,
            data.moderatorId,
            data.reason,
            data.reportId ?? null,
        );
        const created = await this.sanctionRepository.createSanction(sanction);
        await this.banService.setBanned(data.targetType, data.targetId, 1);
        return toSanctionDTO(created);
    }
}
