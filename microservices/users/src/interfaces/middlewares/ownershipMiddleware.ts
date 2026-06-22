import { NextFunction } from 'express';

// Middleware pour vérifier que l'utilisateur modifie bien SON propre profil
// ou qu'il a les droits d'administration/modération
export const requireProfileOwnershipOrAdmin = (req: any, res: any, next: NextFunction) => {
    // Vérifier que l'utilisateur est bien connecté (doit être placé après authenticate)
    if (!req.user) {
        return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;
    
    // L'ID du profil qu'on essaie de modifier ou supprimer (via les paramètres de l'URL)
    const targetProfileId = req.params.id;

    // Si la route n'a pas d'ID, on ne peut pas vérifier la propriété ici
    if (!targetProfileId) {
        return res.status(400).json({ message: 'ID de profil manquant dans la requête' });
    }

    // 1. Les Administrateurs et Modérateurs ont tous les droits
    if (['Administrateur', 'Modérateur'].includes(currentUserRole)) {
        return next(); // Autorisé
    }

    // 2. Un Utilisateur normal ne peut agir que sur l'ID correspondant à son propre ID
    if (currentUserId === targetProfileId) {
        return next(); // Autorisé
    }

    // 3. Dans tous les autres cas, on bloque
    return res.status(403).json({ 
        message: "Accès refusé - Vous n'êtes pas autorisé à modifier le profil d'un autre utilisateur" 
    });
};
