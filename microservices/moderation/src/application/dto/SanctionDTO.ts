import { Sanction } from '../../domain/entities/Sanction';

export interface SanctionDTO {
    id: string;
    targetId: string;
    targetType: string;
    moderatorId: string;
    reportId: string | null;
    type: string | null;
    reason: string;
    fl_active: number;
    createdAt: Date;
}

export function toSanctionDTO(sanction: Sanction): SanctionDTO {
    return {
        id: sanction.id!,
        targetId: sanction.targetId,
        targetType: sanction.targetType,
        moderatorId: sanction.moderatorId,
        reportId: sanction.reportId,
        type: sanction.type,
        reason: sanction.reason,
        fl_active: sanction.fl_active,
        createdAt: sanction.createdAt,
    };
}
