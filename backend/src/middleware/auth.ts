import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        customer_id: string;
        tenant_id: string;
        role: string;
        user_id: string;
    };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.cookies?.access_token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        console.log('[AUTH] No token found - returning 401');
        res.status(401).json({ error: 'Unauthorized: No token provided' });
        return;
    }

    const secret = process.env.JWT_SECRET || 'supersecret_fallback_key';

    try {
        const decoded = jwt.verify(token, secret) as any;
        req.user = {
            customer_id: decoded.customer_id,
            tenant_id: decoded.tenant_id,
            role: decoded.role,
            user_id: decoded.user_id
        };
        next();
    } catch (error) {
        console.error('[AUTH] Token verification failed:', error);
        res.status(403).json({ error: 'Forbidden: Invalid token' });
    }
};
