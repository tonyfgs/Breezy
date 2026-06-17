import { IReportRepository } from '../../domain/repositories/IReportRepository';
import { ReportDTO, toReportDTO } from '../dto/ReportDTO';

export class GetReportUseCase {
    constructor(private readonly reportRepository: IReportRepository) {}

    async execute(id: string): Promise<ReportDTO> {
        const report = await this.reportRepository.getReport(id);
        return toReportDTO(report);
    }
}
