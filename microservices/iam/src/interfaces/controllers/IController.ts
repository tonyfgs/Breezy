import { Router } from 'express';

export interface IController {
    readonly path: string;
    readonly router: Router;
}
