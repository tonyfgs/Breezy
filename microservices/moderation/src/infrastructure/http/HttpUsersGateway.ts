export class HttpUsersGateway {
    constructor(private readonly baseUrl: string, private readonly serviceSecret: string) {}

    async countUsers(): Promise<number> {
        const response = await fetch(`${this.baseUrl}/users/`, {
            headers: { 'x-service-secret': this.serviceSecret },
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        const users = await response.json() as Array<unknown>;
        return users.length;
    }
}
