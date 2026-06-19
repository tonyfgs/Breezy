import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { UserMapper } from '../mapper/userMapper';
import UserModel from '../models/UserModel';

export class UserRepository implements IUserRepository {
    async getAllUsers(): Promise<User[]> {
        const results = await UserModel.findAll();
        return results.map(UserMapper.toDomain);
    }

    async getUserByUsername(username: string): Promise<User | null> {
        const result = await UserModel.findOne({ where: { username } });
        if (!result) return null;
        return UserMapper.toDomain(result);
    }

    async getUserById(id: number): Promise<User | null> {
        const result = await UserModel.findOne({ where: { id } });
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

    async deleteUser(id: number): Promise<void> {
        await UserModel.destroy({ where: { id } });
    }
}
