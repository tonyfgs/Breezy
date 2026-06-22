import { NextFunction } from 'express';
import { verifyToken } from '../../infrastructure/utils/jwt.util';

export const authenticate = (req: any, res: any, next: NextFunction) => {
    // Récupération du token depuis l'en-tête Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Non autorisé - Token manquant ou mal formaté' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Vérification et décodage du token via l'utilitaire existant
        const decoded: any = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ message: 'Non autorisé - Token invalide ou expiré' });
        }

        // On attache les infos utilisateur à la requête
        req.user = {
            id: decoded.id,
            username: decoded.username,
            role: decoded.role
        };

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Non autorisé - Erreur de validation du Token' });
    }
};
