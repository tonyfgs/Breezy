import {IPostGateway} from "../../domain/gateway/IPostGateway";
import {PostEntity} from "../../domain/entities/PostEntity";

export class GetPostUserUseCase {
    private readonly postGateway: IPostGateway;
    constructor(repository: IPostGateway) {
        this.postGateway = repository;
    }

    async execute(authorIds: Array<string>, limit: number = 20, cursor?: string): Promise<{ posts: PostEntity[]; nextCursor?: string }> {
        return this.postGateway.getPostsByAuthorsIds(authorIds, limit, cursor);
    }
}