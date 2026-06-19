import {IFeedRankingService} from "../../domain/services/IFeedRankingService";
import {PostEntity} from "../../domain/entities/PostEntity";
import {ISortingRule} from "../../domain/services/ISortingRule";
import {GetFollowerUseCase} from "../usecases/GetFollowerUseCase";
import {GetPostUserUseCase} from "../usecases/GetPostUserUseCase";

export class FeedRankingService implements IFeedRankingService {
    private readonly sortingRules: Array<ISortingRule>;

    private getFollowersUseCase: GetFollowerUseCase;
    private getPostUserUseCase: GetPostUserUseCase;

    constructor(sortingRules: Array<ISortingRule>, getFollowersUseCase: GetFollowerUseCase , getPostUserUseCase: GetPostUserUseCase) {
        this.sortingRules = sortingRules;
        this.getFollowersUseCase = getFollowersUseCase;
        this.getPostUserUseCase = getPostUserUseCase;
    }

    async build(userId:string): Promise<PostEntity[]> {
        const followers: string[] = await this.getFollowersUseCase.execute(userId);
        const { posts, nextCursor } = await this.getPostUserUseCase.execute(followers, 20);
        let postsSorted = posts;
        for(const sortingRule of this.sortingRules){
            postsSorted = sortingRule.sort(postsSorted);
        }
        return postsSorted;
    }
}