import {PostEntity} from "../entities/PostEntity";

export interface IPostGateway {
    getPostsByAuthorsIds(userId: Array<string>): Promise<Array<PostEntity>>;
}