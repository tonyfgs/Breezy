import {IUserGateway} from "../../domain/gateway/IUserGateway";
import {IPostGateway} from "../../domain/gateway/IPostGateway";
import {IModerationGateway} from "../../domain/gateway/IModerationGateway";
import {IFeedRankingService} from "../../domain/services/IFeedRankingService";
import {PostEntity} from "../../domain/entities/PostEntity";

export class GetFeedUseCase {
    constructor(
        private readonly userGateway: IUserGateway,
        private readonly postGateway: IPostGateway,
        private readonly moderationGateway: IModerationGateway,
        private readonly feedRankingService: IFeedRankingService,
    ) {}

    async execute(userId: string, limit: number = 20, cursor?: string): Promise<{ posts: PostEntity[]; nextCursor?: string }> {
        const followedUserIds = await this.userGateway.getFollowingUser(userId);
        const activeUserIds = await this.moderationGateway.getUserActive(followedUserIds);
        const { posts, nextCursor } = await this.postGateway.getPostsByAuthorsIds(activeUserIds, limit, cursor);
        const rankedPosts = this.feedRankingService.rank(posts);
        return { posts: rankedPosts, nextCursor };
    }
}
