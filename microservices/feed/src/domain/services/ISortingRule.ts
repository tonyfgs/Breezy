import {PostEntity} from "../entities/PostEntity";

export interface ISortingRule {
    sort(posts: Array<PostEntity>): Array<PostEntity>;
}