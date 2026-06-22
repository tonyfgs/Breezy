import {IFeedRankingService} from "../../domain/services/IFeedRankingService";
import {PostEntity} from "../../domain/entities/PostEntity";
import {ISortingRule} from "../../domain/services/ISortingRule";

export class FeedRankingService implements IFeedRankingService {
    private readonly sortingRules: Array<ISortingRule>;

    constructor(sortingRules: Array<ISortingRule>) {
        this.sortingRules = sortingRules;
    }

    rank(posts: Array<PostEntity>): Array<PostEntity> {
        let sorted = posts;
        for (const rule of this.sortingRules) {
            sorted = rule.sort(sorted);
        }
        return sorted;
    }
}