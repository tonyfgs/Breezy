import { IReportRepository } from '../../domain/repositories/IReportRepository';
import { UpdateReportDTO } from '../dto/UpdateReportDTO';
import { ReportDTO, toReportDTO } from '../dto/ReportDTO';

export class UpdateReportUseCase {
    constructor(private readonly reportRepository: IReportRepository) {}

    async execute(id: string, data: UpdateReportDTO): Promise<ReportDTO> {
        const updated = await this.reportRepository.updateReport(id, {
            status: data.status,
            moderatorId: data.moderatorId,
            updatedAt: new Date(),
        });
        return toReportDTO(updated);
    }
}
