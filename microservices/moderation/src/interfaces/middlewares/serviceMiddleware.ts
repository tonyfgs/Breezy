import { NextFunction } from 'express';
import { authenticate } from './authMiddleware';

export const authenticateOrService = (req: any, res: any, next: NextFunction) => {
    const serviceSecret = req.headers['x-service-secret'];
    if (serviceSecret && serviceSecret === process.env.SERVICE_SECRET) {
        req.user = { id: 'service', role: 'admin' };
        return next();
    }
    return authenticate(req, res, next);
};
