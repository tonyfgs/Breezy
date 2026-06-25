import { User } from '../../domain/entities/User';
import { Role } from '../../domain/entities/Role';

export interface UserDTO {
    id: number;
    username: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}

export function toDTO(user: User): UserDTO {
    return {
        id: user.id!,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}
