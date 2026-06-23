import { NextFunction } from 'express';
import { verifyToken } from '../../infrastructure/utils/jwt.util';

export const rejectIfAuthenticated = (req: any, res: any, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        if (decoded) {
            return res.status(403).json({ message: 'Forbidden - Already authenticated, logout first' });
        }
    }
    next();
};

export const authenticate = (req: any, res: any, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized - Missing or malformed token' });
    }

    const token = authHeader.split(' ')[1];

    const decoded: any = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ message: 'Unauthorized - Invalid or expired token' });
    }

    req.user = {
        id: decoded.iamId,
        username: decoded.username,
        role: decoded.role,
    };

    next();
};
