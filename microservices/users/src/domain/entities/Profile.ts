export class Profile {
    id: string;
    username: string;
    bio: string;
    avatar: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: string, username: string, bio: string, avatar: string) {
        this.id = id;
        this.username = username;
        this.bio = bio;
        this.avatar = avatar;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

}