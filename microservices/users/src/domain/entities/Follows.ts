export class Follows {
    follwerId: string;
    followingId: string;
    createdAt: Date;

    constructor(follwerId: string, followingId: string) {
        this.follwerId = follwerId;
        this.followingId = followingId;
        this.createdAt = new Date();
    }
}