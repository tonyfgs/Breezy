import { NextFunction } from 'express';

// Middleware pour exiger un ou plusieurs rôles spécifiques
export const requireRole = (allowedRoles: string[]) => {
    return (req: any, res: any, next: NextFunction) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: 'Utilisateur non authentifié' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Accès refusé - Rôle insuffisant. Requis: ${allowedRoles.join(', ')}` 
            });
        }

        next();
    };
};
