import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { UserMapper } from '../mapper/userMapper';
import UserModel from '../models/UserModel';

export class UserRepository implements IUserRepository {
    async getUserByUsername(username: string): Promise<User | null> {
        const result = await UserModel.findOne({ where: { username } });
        if (!result) return null;
        return UserMapper.toDomain(result);
    }

    async createUser(user: User): Promise<User> {
        const result = await UserModel.create({
            username: user.username,
            passwordHash: user.passwordHash,
            role: user.role,
        });
        return UserMapper.toDomain(result);
    }
}
