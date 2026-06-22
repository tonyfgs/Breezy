export interface IUserGateway {
    getFollowingUser(id: string): Promise<Array<string>>
}