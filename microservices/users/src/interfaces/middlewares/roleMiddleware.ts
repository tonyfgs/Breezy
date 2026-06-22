import { NextFunction } from 'express';

// Middleware (factory) pour exiger un ou plusieurs rôles spécifiques
export const requireRole = (allowedRoles: string[]) => {
    return (req: any, res: any, next: NextFunction) => {
        // On vérifie que l'utilisateur est bien défini (il doit passer par authenticate avant)
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: 'Utilisateur non authentifié' });
        }

        // On vérifie si son rôle est dans la liste des rôles autorisés
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Accès refusé - Rôle insuffisant. Requis: ${allowedRoles.join(', ')}` 
            });
        }

        next(); // Autorisé
    };
};
