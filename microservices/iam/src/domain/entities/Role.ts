export type Role = 'user' | 'moderator' | 'admin';

export const ROLES: Role[] = ['user', 'moderator', 'admin'];

export function isRole(value: unknown): value is Role {
    return ROLES.includes(value as Role);
}
