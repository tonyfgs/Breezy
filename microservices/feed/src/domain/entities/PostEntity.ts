export interface PostEntity {
    id: string;
    authorId: string;
    content: string;
    likeCount: number;
    createdAt: Date;
    updatedAt: Date;
}