import {ISortingRule} from "./ISortingRule";
import {PostEntity} from "../entities/PostEntity";

export class FeedRankingService {
    private readonly sortingRules: Array<ISortingRule>;

    constructor(sortingRules: Array<ISortingRule>) {
        this.sortingRules = sortingRules;
    }

    build(posts: Array<PostEntity>): Array<PostEntity> {


        return posts;
    }
}