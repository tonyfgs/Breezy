import {Profile} from "../../domain/entities/Profile";

export interface ProfileDTO {
    id: string;
    username: string;
    bio: string;
    avatar: string;
    createdAt: Date;
    updatedAt: Date;
}

export function toDTO(profile: Profile): ProfileDTO {
    return {
        id: profile.id!,
        username: profile.username,
        bio: profile.bio,
        avatar: profile.avatar,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
    };
}