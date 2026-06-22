import {IModerationGateway} from "../../../domain/gateway/IModerationGateway";
import {PostEntity} from "../../../domain/entities/PostEntity";

export class MockModerationGateway implements IModerationGateway {
    constructor(private readonly baseUrl: string) {
    }

    async getUserActive(userIds: string[]): Promise<string[]> {
        return userIds;
    }

    async getPostsAllowedToShow(postIds: string[]): Promise<PostEntity[]> {
        return [];
    }
}
