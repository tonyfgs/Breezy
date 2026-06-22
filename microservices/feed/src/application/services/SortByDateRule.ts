import {ISortingRule} from "../../domain/services/ISortingRule";
import {PostEntity} from "../../domain/entities/PostEntity";

export class SortByDateRule implements ISortingRule {
    sort(posts: PostEntity[]): PostEntity[] {
        return [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
}
