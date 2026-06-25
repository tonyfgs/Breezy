import mongoose, { Schema, Document } from 'mongoose';

export interface ILikeDocument extends Document {
    postId: mongoose.Types.ObjectId;
    userId: string;
    createdAt: Date;
}

const LikeSchema = new Schema<ILikeDocument>({
    postId: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
    userId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

LikeSchema.index({ postId: 1, userId: 1 }, { unique: true });

export const LikeModel = mongoose.model<ILikeDocument>('Like', LikeSchema);
