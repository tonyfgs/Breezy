import mongoose, { Schema, Document } from 'mongoose';

export interface IPostDocument extends Document {
    authorId: string;
    content: string;
    parentPostId: mongoose.Types.ObjectId | null;
    tagsList: string[];
    mediaList: string[];
    mentionsList: string[];
    fl_banned: number;
    createdAt: Date;
    updatedAt: Date;
}

const PostSchema = new Schema<IPostDocument>({
    authorId: { type: String, required: true },
    content: { type: String, required: true },
    parentPostId: { type: Schema.Types.ObjectId, default: null },
    tagsList: { type: [String], default: [] },
    mediaList: { type: [String], default: [] },
    mentionsList: { type: [String], default: [] },
    fl_banned: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export const PostModel = mongoose.model<IPostDocument>('Post', PostSchema);
