import {PostDTO} from "./PostDTO";

export class FeedDto {
    constructor(
        public readonly posts: PostDTO[],
        public readonly nextCursor?: string,
    ) {}
}