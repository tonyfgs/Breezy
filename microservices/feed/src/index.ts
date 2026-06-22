import type {IController} from "./interfaces/controllers/IController";
import app from "./app";
import {FeedController} from "./interfaces/controllers/FeedController";
import {FeedRankingService} from "./application/services/FeedRankingService";
import {HttpPostGateway} from "./infrastructure/http/HttpPostGateway";
import {HttpUserGateway} from "./infrastructure/http/HttpUserGateway";
import {HttpModerationGateway} from "./infrastructure/http/HttpModerationGateway";
import {GetFeedUseCase} from "./application/usecases/GetFeedUseCase";
import {SortByDateRule} from "./application/services/SortByDateRule";

const PORT = process.env.PORT || 3001;

const httpPostGateway = new HttpPostGateway(process.env.BASE_URL_POSTS || 'http://posts:4003');
const httpUserGateway = new HttpUserGateway(process.env.BASE_URL_USERS || 'http://users:4001');
const httpModerationGateway = new HttpModerationGateway(process.env.BASE_URL_MODERATION || 'http://moderation:4005');

const feedRankingService = new FeedRankingService([new SortByDateRule()]);
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
