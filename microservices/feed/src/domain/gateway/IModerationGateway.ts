import {PostEntity} from "../entities/PostEntity";

export interface IModerationGateway {
    getPostsAllowedToShow(): Promise<Array<PostEntity>>;
}