import type {IController} from "./interfaces/controllers/IController";
import app from "./app";
import {FeedController} from "./interfaces/controllers/FeedController";
import {FeedRankingService} from "./application/services/FeedRankingService";
import {HttpPostGateway} from "./infrastructure/http/HttpPostGateway";
import {HttpUserGateway} from "./infrastructure/http/HttpUserGateway";
import {HttpModerationGateway} from "./infrastructure/http/HttpModerationGateway";
import {GetFeedUseCase} from "./application/usecases/GetFeedUseCase";
import {SortByDateRule} from "./application/services/SortByDateRule";
import {ISortingRule} from "./domain/services/ISortingRule";
import {MockModerationGateway} from "./infrastructure/http/mock/mockModerationGateway";
import {IModerationGateway} from "./domain/gateway/IModerationGateway";
import {IUserGateway} from "./domain/gateway/IUserGateway";
import {IPostGateway} from "./domain/gateway/IPostGateway";

const PORT = process.env.PORT || 4004;

const httpPostGateway: IPostGateway = new HttpPostGateway(process.env.BASE_URL_POSTS || 'http://posts:4003');
const httpUserGateway: IUserGateway = new HttpUserGateway(process.env.BASE_URL_USERS || 'http://users:4002');
const httpModerationGateway: IModerationGateway = new MockModerationGateway(process.env.BASE_URL_MODERATION || 'http://moderation:4005');


const sortingRules: Array<ISortingRule> = []
sortingRules.push(new SortByDateRule());

const feedRankingService = new FeedRankingService(sortingRules);
const getFeedUseCase = new GetFeedUseCase(httpUserGateway, httpPostGateway, httpModerationGateway, feedRankingService);

const controllerTable: Array<IController> = [];
const feedController = new FeedController(getFeedUseCase);
controllerTable.push(feedController);

for (const controller of controllerTable) {
    app.use(controller.path, controller.router);
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
