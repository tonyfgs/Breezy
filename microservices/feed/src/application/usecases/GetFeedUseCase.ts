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

        const { posts } = await this.postGateway.getPostsByAuthorsIds(activeUserIds, 500);
        const rankedPosts = this.feedRankingService.rank(posts);

        const offset = cursor ? (parseInt(cursor, 10) || 0) : 0;
        const page = rankedPosts.slice(offset, offset + limit);
        const nextCursor = offset + limit < rankedPosts.length ? String(offset + limit) : undefined;

        return { posts: page, nextCursor };
    }
}
