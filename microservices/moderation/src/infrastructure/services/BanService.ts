export class BanService {
    private readonly usersUrl: string;
    private readonly postsUrl: string;

    constructor() {
        this.usersUrl = process.env.USERS_SERVICE_URL || 'http://users:4002';
        this.postsUrl = process.env.POSTS_SERVICE_URL || 'http://posts:4003';
    }

    async setBanned(targetType: 'user' | 'post', targetId: string, banned: 0 | 1): Promise<void> {
        const url = targetType === 'user'
            ? `${this.usersUrl}/users/${targetId}`
            : `${this.postsUrl}/posts/${targetId}`;

        const response = await fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fl_banned: banned }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update fl_banned on ${targetType} ${targetId}: ${response.status}`);
        }
    }
}
