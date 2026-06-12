import app from './app';
import sequelize from './infrastructure/config/database';
import { UserRepository } from './infrastructure/repository/AuthRepository';
import { RegisterUseCase } from './application/usecases/RegisterUseCase';
import { LoginUseCase } from './application/usecases/LoginUseCase';
import { UserController } from './interfaces/controllers/UserController';
import { IController } from './interfaces/controllers/IController';
import 'dotenv/config';

const PORT = process.env.PORT || 3001;

const controllerTable = new Array<IController>();

const userRepository = new UserRepository();
const userController = new UserController(
    new LoginUseCase(userRepository),
    new RegisterUseCase(userRepository)
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
