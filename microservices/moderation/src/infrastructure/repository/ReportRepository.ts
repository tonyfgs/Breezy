import { IReportRepository, ReportFilters } from '../../domain/repositories/IReportRepository';
import { Report } from '../../domain/entities/Report';
import { ReportMapper } from '../mapper/reportMapper';
import { ReportModel } from '../models/ReportModel';

export class ReportRepository implements IReportRepository {
    async getAllReports(filters: ReportFilters): Promise<Report[]> {
        const query: Record<string, unknown> = {};
        if (filters.status) query.status = filters.status;
        if (filters.targetType) query.targetType = filters.targetType;
        const results = await ReportModel.find(query);
        return results.map(ReportMapper.toDomain);
    }

    async getReport(id: string): Promise<Report> {
        const result = await ReportModel.findById(id);
        if (!result) throw new Error(`Report not found: ${id}`);
        return ReportMapper.toDomain(result);
    }

    async createReport(report: Report): Promise<Report> {
        const result = await ReportModel.create(report);
        return ReportMapper.toDomain(result);
    }

    async updateReport(id: string, data: Partial<Report>): Promise<Report> {
        const result = await ReportModel.findByIdAndUpdate(
            id,
            { ...data, updatedAt: new Date() },
            { new: true }
        );
        if (!result) throw new Error(`Report not found: ${id}`);
        return ReportMapper.toDomain(result);
    }

    async countPendingReports(): Promise<number> {
        return ReportModel.countDocuments({ status: 'pending' });
    }
}
