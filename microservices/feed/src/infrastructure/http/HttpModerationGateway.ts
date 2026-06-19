import {IModerationGateway} from "../../domain/gateway/IModerationGateway";
import {PostEntity} from "../../domain/entities/PostEntity";

export class HttpModerationGateway implements IModerationGateway{
    getPostsAllowedToShow(postIds:Array<string>): Promise<Array<PostEntity>> {
        throw new Error("Method not implemented.");
    }

    getUserActive(userId: Array<string>): Promise<Array<string>> {
        throw new Error("Method not implemented.");
    }
}