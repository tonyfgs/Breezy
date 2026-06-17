export interface CreateReportDTO {
    reporterId: string;
    targetId: string;
    targetType: 'post' | 'user';
    reason: string;
}
