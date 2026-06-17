import { Post } from '../../domain/entities/Post';

export interface PostDTO {
    id: string;
    authorId: string;
    content: string;
    parentPostId: string | null;
    tagsList: string[];
    mediaList: string[];
    mentionsList: string[];
    fl_banned: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface PaginatedPostsDTO {
    data: PostDTO[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export function toDTO(post: Post): PostDTO {
    return {
        id: post.id!,
        authorId: post.authorId,
        content: post.content,
        parentPostId: post.parentPostId,
        tagsList: post.tagsList,
        mediaList: post.mediaList,
        mentionsList: post.mentionsList,
        fl_banned: post.fl_banned,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
    };
}
