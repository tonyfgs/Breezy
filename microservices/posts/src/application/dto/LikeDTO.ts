import { Like } from '../../domain/entities/Like';

export interface LikeDTO {
    id: string;
    postId: string;
    userId: string;
    createdAt: Date;
}

export interface PaginatedLikesDTO {
    data: LikeDTO[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export function toLikeDTO(like: Like): LikeDTO {
    return {
        id: like.id!,
        postId: like.postId,
        userId: like.userId,
        createdAt: like.createdAt,
    };
}
