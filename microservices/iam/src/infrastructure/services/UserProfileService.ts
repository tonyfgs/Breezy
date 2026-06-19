export class UserProfileService {
    private readonly usersUrl: string;

    constructor() {
        this.usersUrl = process.env.USERS_SERVICE_URL || 'http://users:4002';
    }

    async createProfile(username: string): Promise<void> {
        const response = await fetch(`${this.usersUrl}/users/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, bio: null, avatar: null }),
        });

        if (!response.ok) {
            throw new Error(`Failed to create profile for ${username}: ${response.status}`);
        }
    }

    async deleteProfile(username: string): Promise<void> {
        const response = await fetch(`${this.usersUrl}/users/username/${username}`, {
            method: 'DELETE',
        });

        if (!response.ok && response.status !== 404) {
            throw new Error(`Failed to delete profile for ${username}: ${response.status}`);
        }
    }
}
