export interface IFollowRepository {
    getFollowers(id: string): Promise<Array<string>>;
    getFollowing(id: string): Promise<Array<string>>;
    createFollow(follwerId: string, followingId: string): Promise<Array<string>>;
    deleteFollow(follwerId: string, followingId: string): Promise<Array<string>>;
}