import {ISortingRule} from "../../domain/services/ISortingRule";
import {PostEntity} from "../../domain/entities/PostEntity";

export class SortByDateRule implements ISortingRule {
    sort(posts: PostEntity[]): PostEntity[] {
        return [...posts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
}
