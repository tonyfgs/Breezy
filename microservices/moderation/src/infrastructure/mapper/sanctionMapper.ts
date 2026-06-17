import { Sanction } from '../../domain/entities/Sanction';
import { ISanctionDocument } from '../models/SanctionModel';

export class SanctionMapper {
    static toDomain(doc: ISanctionDocument): Sanction {
        const sanction = new Sanction(
            doc.targetId,
            doc.targetType,
            doc.moderatorId,
            doc.reason,
            doc.reportId,
            doc.type,
            doc._id.toString()
        );
        sanction.fl_active = doc.fl_active;
        sanction.createdAt = doc.createdAt;
        return sanction;
    }
}
