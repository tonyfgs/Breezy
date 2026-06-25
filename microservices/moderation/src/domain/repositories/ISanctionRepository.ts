import { Sanction } from '../entities/Sanction';

export interface SanctionFilters {
    targetId?: string;
    targetType?: string;
    fl_active?: number;
}

export interface ISanctionRepository {
    getAllSanctions(filters: SanctionFilters): Promise<Sanction[]>;
    getSanction(id: string): Promise<Sanction>;
    getActiveSanctionByTarget(targetId: string): Promise<Sanction | null>;
    createSanction(sanction: Sanction): Promise<Sanction>;
    updateSanction(id: string, data: Partial<Sanction>): Promise<Sanction>;
    countActiveSanctions(targetType: 'user' | 'post'): Promise<number>;
}
