import mongoose, {Types} from 'mongoose';
import app from './app';
import { ProfileRepository } from './infrastructure/repository/ProfileRepository';
import { GetProfileUseCase } from './application/usecases/GetProfileUseCase';
import { CreateProfileUseCase } from './application/usecases/CreateProfileUseCase';
import { DeleteProfileUseCase } from './application/usecases/DeleteProfileUseCase';
import { UpdateProfileUseCase } from './application/usecases/UpdateProfileUseCase';
import { GetAllProfilesUseCase } from './application/usecases/GetAllProfilesUseCase';
import { ProfileController } from './interfaces/controllers/ProfileController';
import 'dotenv/config';
import {IController} from "./interfaces/controllers/IController";

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Controller table
const controllerTable = new Array<IController>;

// DI
const profileRepository = new ProfileRepository();
const profileController = new ProfileController(
    new GetProfileUseCase(profileRepository),
    new CreateProfileUseCase(profileRepository),
    new DeleteProfileUseCase(profileRepository),
    new UpdateProfileUseCase(profileRepository),
    new GetAllProfilesUseCase(profileRepository)
);

controllerTable.push(profileController);

for (const controller of controllerTable) {
    app.use(controller.path, controller.router);
}

// Routes

if (MONGODB_URI === undefined)
    throw new Error("MONGODB_URI is not defined")


mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1); // No DB = no API
    });