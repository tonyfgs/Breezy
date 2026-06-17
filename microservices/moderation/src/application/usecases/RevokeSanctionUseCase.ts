import { ISanctionRepository } from '../../domain/repositories/ISanctionRepository';
import { BanService } from '../../infrastructure/services/BanService';
import { SanctionDTO, toSanctionDTO } from '../dto/SanctionDTO';

export class RevokeSanctionUseCase {
    constructor(
        private readonly sanctionRepository: ISanctionRepository,
        private readonly banService: BanService,
    ) {}

    async execute(id: string): Promise<SanctionDTO | null> {
        const sanction = await this.sanctionRepository.getSanction(id);
        if (sanction.fl_active === 0) return null;

        const updated = await this.sanctionRepository.updateSanction(id, { fl_active: 0 });
        await this.banService.setBanned(sanction.targetType, sanction.targetId, 0);
        return toSanctionDTO(updated);
    }
}
