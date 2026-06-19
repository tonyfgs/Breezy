import {IPostGateway} from "../../domain/./gateway/IPostGateway";
import {PostEntity} from "../../domain/entities/PostEntity";

export class HttpPostGateway implements IPostGateway{
    private readonly urlService: string;

    constructor(urlService: string) {
        this.urlService = urlService;
    }

    async getPostsByAuthorsIds(userIds: Array<string>): Promise<Array<PostEntity>> {

        throw new Error("Method not implemented.");
    }

}