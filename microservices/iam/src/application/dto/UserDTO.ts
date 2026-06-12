import { User } from '../../domain/entities/User';

export interface UserDTO {
    id: number;
    username: string;
    role: string;
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
