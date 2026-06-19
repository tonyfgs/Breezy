import { IReportRepository } from '../../domain/repositories/IReportRepository';
import { Report } from '../../domain/entities/Report';
import { CreateReportDTO } from '../dto/CreateReportDTO';
import { ReportDTO, toReportDTO } from '../dto/ReportDTO';

export class CreateReportUseCase {
    constructor(private readonly reportRepository: IReportRepository) {}

    async execute(data: CreateReportDTO): Promise<ReportDTO> {
        const report = new Report(data.reporterId, data.targetId, data.targetType, data.reason);
        const created = await this.reportRepository.createReport(report);
        return toReportDTO(created);
    }
}
