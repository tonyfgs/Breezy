export class User{                                                                                                                                                                                   
    id?: number;                                                                                                                                                                               
    username: string;
    passwordHash: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(username: string, passwordHash: string, role: string, id?: number) {
        this.id = id;
        this.username = username;
        this.passwordHash = passwordHash;
        this.role = role;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
