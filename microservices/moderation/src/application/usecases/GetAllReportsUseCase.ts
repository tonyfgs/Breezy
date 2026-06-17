import { IReportRepository, ReportFilters } from '../../domain/repositories/IReportRepository';
import { ReportDTO, toReportDTO } from '../dto/ReportDTO';

export class GetAllReportsUseCase {
    constructor(private readonly reportRepository: IReportRepository) {}

    async execute(filters: ReportFilters): Promise<ReportDTO[]> {
        const reports = await this.reportRepository.getAllReports(filters);
        return reports.map(toReportDTO);
    }
}
