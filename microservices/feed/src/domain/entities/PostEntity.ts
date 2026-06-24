export interface PostEntity {
    id: string;
    authorId: string;
    content: string;
    likeCount: number;
    commentCount: number;
    createdAt: Date;
    updatedAt: Date;
}
