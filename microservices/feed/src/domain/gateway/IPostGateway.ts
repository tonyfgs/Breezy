import {PostEntity} from "../entities/PostEntity";

export interface IPostGateway {
    getPostsByAuthorsIds(userIds: string[], limit: number, cursor?: string): Promise<{ posts: PostEntity[]; nextCursor?: string }>;
}