import {Profile} from "../../domain/entities/Profile";

export interface ProfileDTO {
    id: string;
    username: string;
    bio: string;
    avatar: string;
    fl_banned: number;
    createdAt: Date;
    updatedAt: Date;
}

export function toDTO(profile: Profile): ProfileDTO {
    return {
        id: profile.id!,
        username: profile.username,
        bio: profile.bio,
        avatar: profile.avatar,
        fl_banned: profile.fl_banned,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
    };
}