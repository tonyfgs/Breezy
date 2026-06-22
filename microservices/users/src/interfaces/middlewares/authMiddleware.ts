import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Assurez-vous d'avoir le même JWT_SECRET que le microservice 'iam' dans votre .env
const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecret';

export interface JwtPayload {
    id: string;
    username: string;
    role: string;
}

// Middleware pour vérifier l'authentification avec JWT
export const authenticate = (req: any, res: any, next: NextFunction) => {
    // Récupération du token depuis l'en-tête Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Non autorisé - Token manquant ou mal formaté' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Vérification et décodage du token
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

        // On attache les infos utilisateur (dont le rôle) à la requête
        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Non autorisé - Token invalide ou expiré' });
    }
};
