import type {Router} from "express";

export interface IController {
    path: string;
    router: Router;
}