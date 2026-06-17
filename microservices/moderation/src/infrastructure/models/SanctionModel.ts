import mongoose, { Schema, Document } from 'mongoose';

export interface ISanctionDocument extends Document {
    targetId: string;
    targetType: 'post' | 'user';
    moderatorId: string;
    reportId: string | null;
    type: 'ban' | null;
    reason: string;
    fl_active: number;
    createdAt: Date;
}

const SanctionSchema = new Schema<ISanctionDocument>({
    targetId: { type: String, required: true },
    targetType: { type: String, required: true, enum: ['post', 'user'] },
    moderatorId: { type: String, required: true },
    reportId: { type: String, default: null },
    type: { type: String, default: 'ban', enum: ['ban', null] },
    reason: { type: String, required: true },
    fl_active: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now },
});

export const SanctionModel = mongoose.model<ISanctionDocument>('Sanction', SanctionSchema);
