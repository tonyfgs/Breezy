import { Like } from '../../domain/entities/Like';
import { ILikeDocument } from '../models/LikeModel';

export class LikeMapper {
    static toDomain(doc: ILikeDocument): Like {
        const like = new Like(
            doc.postId.toString(),
            doc.userId,
            doc._id.toString()
        );
        like.createdAt = doc.createdAt;
        return like;
    }
}
