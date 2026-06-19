import {IUserGateway} from "../../domain/gateway/IUserGateway";

export class GetFollowerUseCase{
    private readonly userGateway: IUserGateway;

    constructor(userGateway: IUserGateway) {
        this.userGateway = userGateway;
    }

    async execute(id: string): Promise<Array<string>> {
        return this.userGateway.getFollowingUser(id);
    }
}