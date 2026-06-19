import type {IController} from "./interfaces/controllers/IController";
import app from "./app";
import * as mongoose from "mongoose";

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI === undefined)
    throw new Error('MONGODB_URI is not defined');


const controllerTable: Array<IController> = new Array<IController>();

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