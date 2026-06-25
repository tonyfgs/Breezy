import mongoose from 'mongoose';
import app from './app';
import 'dotenv/config';
import { IController } from './interfaces/controllers/IController';
import { ReportRepository } from './infrastructure/repository/ReportRepository';
import { SanctionRepository } from './infrastructure/repository/SanctionRepository';
import { BanService } from './infrastructure/services/BanService';
import { CreateReportUseCase } from './application/usecases/CreateReportUseCase';
import { GetReportUseCase } from './application/usecases/GetReportUseCase';
import { GetAllReportsUseCase } from './application/usecases/GetAllReportsUseCase';
import { UpdateReportUseCase } from './application/usecases/UpdateReportUseCase';
import { CreateSanctionUseCase } from './application/usecases/CreateSanctionUseCase';
import { GetSanctionUseCase } from './application/usecases/GetSanctionUseCase';
import { GetAllSanctionsUseCase } from './application/usecases/GetAllSanctionsUseCase';
import { RevokeSanctionUseCase } from './application/usecases/RevokeSanctionUseCase';
import { ReportController } from './interfaces/controllers/ReportController';
import { SanctionController } from './interfaces/controllers/SanctionController';
import { StatsController } from './interfaces/controllers/StatsController';
import { GetModerationStatsUseCase } from './application/usecases/GetModerationStatsUseCase';
import { GetActiveUsersUseCase } from './application/usecases/GetActiveUsersUseCase';
import { HttpUsersGateway } from './infrastructure/http/HttpUsersGateway';
import { HttpPostsGateway } from './infrastructure/http/HttpPostsGateway';

const PORT = process.env.PORT || 4005;
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI === undefined)
    throw new Error('MONGODB_URI is not defined');

const controllerTable = new Array<IController>();

const reportRepository = new ReportRepository();
const sanctionRepository = new SanctionRepository();
const banService = new BanService();

const reportController = new ReportController(
    new CreateReportUseCase(reportRepository),
    new GetReportUseCase(reportRepository),
    new GetAllReportsUseCase(reportRepository),
    new UpdateReportUseCase(reportRepository),
);

const sanctionController = new SanctionController(
    new CreateSanctionUseCase(sanctionRepository, banService),
    new GetSanctionUseCase(sanctionRepository),
    new GetAllSanctionsUseCase(sanctionRepository),
    new RevokeSanctionUseCase(sanctionRepository, banService),
);

const serviceSecret = process.env.SERVICE_SECRET || '';
const usersGateway = new HttpUsersGateway(process.env.BASE_URL_USERS || 'http://users:4002', serviceSecret);
const postsGateway = new HttpPostsGateway(process.env.BASE_URL_POSTS || 'http://posts:4003', serviceSecret);

const statsController = new StatsController(
    new GetModerationStatsUseCase(reportRepository, sanctionRepository, usersGateway, postsGateway),
    new GetActiveUsersUseCase(sanctionRepository),
);

controllerTable.push(reportController, sanctionController, statsController);

for (const controller of controllerTable) {
    app.use(controller.path, controller.router);
}

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1);
    });
