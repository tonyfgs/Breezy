export class Profile {
    id?: string;
    username: string;
    bio: string | null;
    avatar: string | null;
    fl_banned: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(username: string, bio: string | null, avatar: string | null, id?: string) {
        this.id = id;
        this.username = username;
        this.bio = bio;
        this.avatar = avatar;
        this.fl_banned = 0;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}