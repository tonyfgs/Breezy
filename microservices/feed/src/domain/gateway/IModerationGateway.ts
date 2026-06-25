import {PostEntity} from "../entities/PostEntity";

export interface IModerationGateway {
    getUserActive(userId: Array<string>): Promise<Array<string>>;
    getPostsAllowedToShow(postIds: Array<string>): Promise<Array<PostEntity>>;
}