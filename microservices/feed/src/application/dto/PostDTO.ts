export class PostDTO {
    constructor(
        public readonly id: string,
        public readonly authorId: string,
        public readonly content: string,
        public readonly likeCount: number,
        public readonly commentCount: number,
        public readonly createdAt: Date,
    ) {}
}