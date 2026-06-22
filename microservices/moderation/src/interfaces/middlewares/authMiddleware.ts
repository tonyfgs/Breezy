import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Le JWT_SECRET est synchronisé via le docker-compose
const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecret';

export interface JwtPayload {
    id: string;
    username: string;
    role: string;
}

export const authenticate = (req: any, res: any, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Non autorisé - Token manquant ou mal formaté' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

        req.user = {
            id: decoded.id,
            username: decoded.username,
            role: decoded.role
        };

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Non autorisé - Token invalide ou expiré' });
    }
};
