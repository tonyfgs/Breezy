import {ISortingRule} from "./ISortingRule";
import {PostEntity} from "../entities/PostEntity";

export interface IFeedRankingService {


    build(userId: string): Promise<Array<PostEntity>>;
}