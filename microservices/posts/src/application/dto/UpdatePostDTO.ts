export interface UpdatePostDTO {
    content?: string;
    tagsList?: string[];
    mediaList?: string[];
    mentionsList?: string[];
    fl_banned?: number;
}
