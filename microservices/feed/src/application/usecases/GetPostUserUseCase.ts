import {IPostGateway} from "../../domain/gateway/IPostGateway";

export class GetPostUserUseCase {
    private readonly postGateway: IPostGateway;
    constructor(repository: IPostGateway) {
        this.postGateway = repository;
    }

    execute(id: Array<string>) {
        this.postGateway.getPostsByAuthorsIds(id);
    }
}