// src/infrastructure/models/ProfileModel.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IProfileDocument extends Document {
    username: string;
    bio: string;
    avatar: string;
    createdAt: Date;
    updatedAt: Date;
}

const ProfileSchema = new Schema<IProfileDocument>({
    username: { type: String, required: true, unique: true },
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});


export const ProfileModel = mongoose.model<IProfileDocument>('Profile', ProfileSchema);