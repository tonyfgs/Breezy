import { User } from '../../domain/entities/User';
import UserModel from '../models/UserModel';

export class UserMapper {
    static toDomain(instance: UserModel): User {
        const data = instance.get({ plain: true });
        const user = new User(data.username, data.passwordHash, data.role, data.id);
        user.createdAt = data.createdAt;
        user.updatedAt = data.updatedAt;
        return user;
    }
}
