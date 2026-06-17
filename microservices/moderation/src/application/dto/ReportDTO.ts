import { Report } from '../../domain/entities/Report';

export interface ReportDTO {
    id: string;
    reporterId: string;
    targetId: string;
    targetType: string;
    reason: string;
    status: string;
    moderatorId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export function toReportDTO(report: Report): ReportDTO {
    return {
        id: report.id!,
        reporterId: report.reporterId,
        targetId: report.targetId,
        targetType: report.targetType,
        reason: report.reason,
        status: report.status,
        moderatorId: report.moderatorId,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
    };
}
