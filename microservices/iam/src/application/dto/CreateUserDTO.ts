import { Role } from '../../domain/entities/Role';

export interface CreateUserDTO {
    username: string;
    password: string;
    role?: Role;
}
