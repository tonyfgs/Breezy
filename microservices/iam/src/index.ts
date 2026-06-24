import app from './app';
import sequelize from './infrastructure/config/database';
import { UserRepository } from './infrastructure/repository/AuthRepository';
import { RegisterUseCase } from './application/usecases/RegisterUseCase';
import { LoginUseCase } from './application/usecases/LoginUseCase';
import { UserController } from './interfaces/controllers/UserController';
import { IController } from './interfaces/controllers/IController';
import { UserProfileService } from './infrastructure/services/UserProfileService';
import { GetAllUsersUseCase } from './application/usecases/GetAllUsersUseCase';
import { DeleteUserUseCase } from './application/usecases/DeleteUserUseCase';
import 'dotenv/config';

const PORT = process.env.PORT || 3001;

const controllerTable = new Array<IController>();

const userRepository = new UserRepository();
const userProfileService = new UserProfileService();
const userController = new UserController(
    new LoginUseCase(userRepository, userProfileService),
    new RegisterUseCase(userRepository, userProfileService),
    new GetAllUsersUseCase(userRepository),
    new DeleteUserUseCase(userRepository, userProfileService)
);

controllerTable.push(userController);

for (const controller of controllerTable) {
    app.use(controller.path, controller.router);
}

sequelize.authenticate()
    .then(() => sequelize.sync())
    .then(() => {
        app.listen(PORT, () => {
            console.log(`IAM service running on http://localhost:${PORT}`);
        });
    })
    .catch((err: Error) => {
        console.error('Failed to connect to database:', err.message);
        process.exit(1);
    });
