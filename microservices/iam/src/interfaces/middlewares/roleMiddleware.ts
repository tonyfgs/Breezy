import { NextFunction } from 'express';

// Middleware pour exiger un ou plusieurs rôles spécifiques
export const requireRole = (allowedRoles: string[]) => {
    return (req: any, res: any, next: NextFunction) => {
        // Vérification de la présence de l'utilisateur (via authenticate)
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: 'Utilisateur non authentifié' });
        }

        // Vérification du rôle
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Accès refusé - Rôle insuffisant. Requis: ${allowedRoles.join(', ')}` 
            });
        }

        next(); // Autorisé
    };
};
