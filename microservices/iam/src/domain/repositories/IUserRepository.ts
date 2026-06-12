import {User} from "../entities/User";

export interface IUserRepository {
    getUserByUsername(username: string): Promise<User | null>;
    createUser(user: User): Promise<User>;
}
