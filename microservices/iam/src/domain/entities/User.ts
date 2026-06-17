import { Role } from './Role';

export class User{
    id?: number;
    username: string;
    passwordHash: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;

    constructor(username: string, passwordHash: string, role: Role, id?: number) {
        this.id = id;
        this.username = username;
        this.passwordHash = passwordHash;
        this.role = role;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
