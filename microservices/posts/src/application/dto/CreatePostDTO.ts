export interface CreatePostDTO {
    authorId: string;
    content: string;
    parentPostId?: string | null;
    tagsList?: string[];
    mediaList?: string[];
    mentionsList?: string[];
}
