import {User} from "../entities/User";

export interface IUserRepository {
    getAllUsers(): Promise<User[]>;
    getUserByUsername(username: string): Promise<User | null>;
    createUser(user: User): Promise<User>;
    deleteUser(id: number): Promise<void>;
}
