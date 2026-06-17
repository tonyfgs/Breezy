import { Report } from '../entities/Report';

export interface ReportFilters {
    status?: string;
    targetType?: string;
}

export interface IReportRepository {
    getAllReports(filters: ReportFilters): Promise<Report[]>;
    getReport(id: string): Promise<Report>;
    createReport(report: Report): Promise<Report>;
    updateReport(id: string, data: Partial<Report>): Promise<Report>;
}
