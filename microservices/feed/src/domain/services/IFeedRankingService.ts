import {PostEntity} from "../entities/PostEntity";

export interface IFeedRankingService {
    rank(posts: Array<PostEntity>): Array<PostEntity>;
}