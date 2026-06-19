export interface CreateSanctionDTO {
    targetId: string;
    targetType: 'post' | 'user';
    moderatorId: string;
    reportId?: string | null;
    reason: string;
}
