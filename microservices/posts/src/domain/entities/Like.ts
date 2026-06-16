export class Like {
    id?: string;
    postId: string;
    userId: string;
    createdAt: Date;

    constructor(postId: string, userId: string, id?: string) {
        this.id = id;
        this.postId = postId;
        this.userId = userId;
        this.createdAt = new Date();
    }
}
