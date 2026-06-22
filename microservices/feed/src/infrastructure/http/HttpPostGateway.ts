import {IPostGateway} from "../../domain/./gateway/IPostGateway";
import {PostEntity} from "../../domain/entities/PostEntity";

export class HttpPostGateway implements IPostGateway{

    private readonly baseUrl: string;
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getPostsByAuthorsIds(userIds: string[], limit: number = 20, cursor?: string): Promise<{ posts: PostEntity[]; nextCursor?: string }> {
        const url = `${this.baseUrl}/posts/by-authors`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ authorIds: userIds, limit, cursor })
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }

        return await response.json();
    }

}