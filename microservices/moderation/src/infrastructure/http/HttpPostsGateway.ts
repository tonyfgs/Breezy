export class HttpPostsGateway {
    constructor(private readonly baseUrl: string, private readonly serviceSecret: string) {}

    async getStats(): Promise<{ postsToday: number; totalPosts: number }> {
        const response = await fetch(`${this.baseUrl}/posts/stats`, {
            headers: { 'x-service-secret': this.serviceSecret },
        });
        if (!response.ok) throw new Error('Failed to fetch posts stats');
        return response.json();
    }
}
