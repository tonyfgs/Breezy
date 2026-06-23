import { NextFunction } from 'express';

export const requireRole = (allowedRoles: string[]) => {
    return (req: any, res: any, next: NextFunction) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: 'Unauthorized - User not authenticated' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Forbidden - Insufficient role. Required: ${allowedRoles.join(', ')}`,
            });
        }

        next();
    };
};
