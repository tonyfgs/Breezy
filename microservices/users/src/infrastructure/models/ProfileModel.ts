// src/infrastructure/models/ProfileModel.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IProfileDocument extends Document {
    username: string;
    bio: string | null;
    avatar: string | null;
    fl_banned: number;
    createdAt: Date;
    updatedAt: Date;
}

const ProfileSchema = new Schema<IProfileDocument>({
    username: { type: String, required: true, unique: true },
    bio: { type: String, default: null },
    avatar: { type: String, default: null },
    fl_banned: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});


export const ProfileModel = mongoose.model<IProfileDocument>('Profile', ProfileSchema);