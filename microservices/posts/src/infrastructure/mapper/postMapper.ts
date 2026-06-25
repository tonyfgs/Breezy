import { Post } from '../../domain/entities/Post';
import { IPostDocument } from '../models/PostModel';

export class PostMapper {
    static toDomain(doc: IPostDocument): Post {
        const post = new Post(
            doc.authorId,
            doc.content,
            doc.parentPostId ? doc.parentPostId.toString() : null,
            doc.tagsList,
            doc.mediaList,
            doc.mentionsList,
            doc._id.toString()
        );
        post.fl_banned = doc.fl_banned;
        post.createdAt = doc.createdAt;
        post.updatedAt = doc.updatedAt;
        return post;
    }
}
