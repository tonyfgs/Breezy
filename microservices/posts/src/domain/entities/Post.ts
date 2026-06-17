export class Post {
    id?: string;
    authorId: string;
    content: string;
    parentPostId: string | null;
    tagsList: string[];
    mediaList: string[];
    mentionsList: string[];
    fl_banned: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        authorId: string,
        content: string,
        parentPostId: string | null = null,
        tagsList: string[] = [],
        mediaList: string[] = [],
        mentionsList: string[] = [],
        id?: string
    ) {
        this.id = id;
        this.authorId = authorId;
        this.content = content;
        this.parentPostId = parentPostId;
        this.tagsList = tagsList;
        this.mediaList = mediaList;
        this.mentionsList = mentionsList;
        this.fl_banned = 0;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
