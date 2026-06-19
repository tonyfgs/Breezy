import { Report } from '../../domain/entities/Report';
import { IReportDocument } from '../models/ReportModel';

export class ReportMapper {
    static toDomain(doc: IReportDocument): Report {
        const report = new Report(doc.reporterId, doc.targetId, doc.targetType, doc.reason, doc._id.toString());
        report.status = doc.status;
        report.moderatorId = doc.moderatorId;
        report.createdAt = doc.createdAt;
        report.updatedAt = doc.updatedAt;
        return report;
    }
}
