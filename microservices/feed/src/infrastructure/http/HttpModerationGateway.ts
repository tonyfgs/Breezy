import {IModerationGateway} from "../../domain/gateway/IModerationGateway";
import {PostEntity} from "../../domain/entities/PostEntity";

export class HttpModerationGateway implements IModerationGateway {
    constructor(private readonly baseUrl: string) {}

    async getUserActive(userIds: string[]): Promise<string[]> {
        const response = await fetch(`${this.baseUrl}/moderation/users/active`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-service-secret': process.env.SERVICE_SECRET || '',
            },
            body: JSON.stringify({ userIds }),
        });
        if (!response.ok) throw new Error(`Failed to fetch active users: ${response.statusText}`);
        return response.json();
    }

    async getPostsAllowedToShow(postIds: string[]): Promise<PostEntity[]> {
        const response = await fetch(`${this.baseUrl}/moderation/posts/allowed`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postIds }),
        });
        if (!response.ok) throw new Error(`Failed to fetch allowed posts: ${response.statusText}`);
        return response.json();
    }
}