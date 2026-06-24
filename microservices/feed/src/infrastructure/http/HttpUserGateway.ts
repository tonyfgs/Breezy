import {IUserGateway} from "../../domain/gateway/IUserGateway";

export class HttpUserGateway implements IUserGateway{

    private readonly baseUrl: string;
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getFollowingUser(id: string): Promise<Array<string>> {
        const url = `${this.baseUrl}/follows/${id}/following`;
        const response = await fetch(url, {
            headers: { 'x-service-secret': process.env.SERVICE_SECRET || '' },
        });
        if (!response.ok) throw new Error('Failed to fetch followers');
        return await response.json() as Array<string>;
    }
}