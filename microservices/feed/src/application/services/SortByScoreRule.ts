import { ISortingRule } from "../../domain/services/ISortingRule";
import { PostEntity } from "../../domain/entities/PostEntity";

export class SortByScoreRule implements ISortingRule {
    sort(posts: PostEntity[]): PostEntity[] {
        return [...posts].sort((a, b) => this.score(b) - this.score(a));
    }

    private score(post: PostEntity): number {
        const ageInHours = (Date.now() - new Date(post.createdAt).getTime()) / 3_600_000;
        const engagement = post.likeCount * 2 + post.commentCount * 3;
        return engagement / Math.pow(ageInHours + 2, 1.5);
    }
}
