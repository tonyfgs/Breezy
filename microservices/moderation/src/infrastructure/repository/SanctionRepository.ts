import { ISanctionRepository, SanctionFilters } from '../../domain/repositories/ISanctionRepository';
import { Sanction } from '../../domain/entities/Sanction';
import { SanctionMapper } from '../mapper/sanctionMapper';
import { SanctionModel } from '../models/SanctionModel';

export class SanctionRepository implements ISanctionRepository {
    async getAllSanctions(filters: SanctionFilters): Promise<Sanction[]> {
        const query: Record<string, unknown> = {};
        if (filters.targetId) query.targetId = filters.targetId;
        if (filters.targetType) query.targetType = filters.targetType;
        if (filters.fl_active !== undefined) query.fl_active = filters.fl_active;
        const results = await SanctionModel.find(query);
        return results.map(SanctionMapper.toDomain);
    }

    async getSanction(id: string): Promise<Sanction> {
        const result = await SanctionModel.findById(id);
        if (!result) throw new Error(`Sanction not found: ${id}`);
        return SanctionMapper.toDomain(result);
    }

    async getActiveSanctionByTarget(targetId: string): Promise<Sanction | null> {
        const result = await SanctionModel.findOne({ targetId, fl_active: 1 });
        if (!result) return null;
        return SanctionMapper.toDomain(result);
    }

    async createSanction(sanction: Sanction): Promise<Sanction> {
        const result = await SanctionModel.create(sanction);
        return SanctionMapper.toDomain(result);
    }

    async updateSanction(id: string, data: Partial<Sanction>): Promise<Sanction> {
        const result = await SanctionModel.findByIdAndUpdate(id, data, { new: true });
        if (!result) throw new Error(`Sanction not found: ${id}`);
        return SanctionMapper.toDomain(result);
    }
}
