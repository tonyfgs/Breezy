import mongoose, { Schema, Document } from 'mongoose';

export interface IReportDocument extends Document {
    reporterId: string;
    targetId: string;
    targetType: 'post' | 'user';
    reason: string;
    status: 'pending' | 'reviewed' | 'dismissed';
    moderatorId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

const ReportSchema = new Schema<IReportDocument>({
    reporterId: { type: String, required: true },
    targetId: { type: String, required: true },
    targetType: { type: String, required: true, enum: ['post', 'user'] },
    reason: { type: String, required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'reviewed', 'dismissed'] },
    moderatorId: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export const ReportModel = mongoose.model<IReportDocument>('Report', ReportSchema);
