import mongoose, { Schema, Document } from 'mongoose';


interface IFollowDocument extends Document {
    follwerId: string;
    followingId: string;
    createdAt: Date;
}

const FollowSchema = new Schema<IFollowDocument>({
    follwerId: { type: String, required: true },
    followingId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

export const FollowModel= mongoose.model<IFollowDocument>('Follow', FollowSchema);