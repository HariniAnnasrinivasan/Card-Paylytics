import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }

    try {
        const result = await query('SELECT * FROM saas_users WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const user = result.rows[0];
        
        // Compare password based on the user's password_hash column
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const payload = {
            user_id: user.user_id,
            role: user.role,
            customer_id: user.customer_id,
            tenant_id: user.tenant_id
        };

        const secret = process.env.JWT_SECRET || 'supersecret_fallback_key';
        const token = jwt.sign(payload, secret, { expiresIn: '8h' });

        res.json({
            token,
            role: user.role || 'customer',
            customer_id: user.customer_id
        });
    } catch (error: any) {
        console.error('Login error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
