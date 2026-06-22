import {PostEntity} from "./PostEntity";

export class FeedEntity {
    constructor(
        public readonly posts: PostEntity[],
        public readonly nextCursor?: string,
    ) {}
}