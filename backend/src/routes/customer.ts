import { Router, Response } from 'express';
import { query } from '../db';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(requireAuth);

// Helper function to get customer card_number_masked
const getCustomerCard = async (customerId: string | number) => {
    const result = await query('SELECT card_number_masked FROM customer_behavior WHERE customer_id = $1', [Number(customerId)]);
    return result.rows[0]?.card_number_masked || null;
};

router.get('/profile', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const customerId = req.user!.customer_id;
        console.log('[PROFILE] Fetching profile for customer_id:', customerId);
        const result = await query('SELECT * FROM customer_behavior WHERE customer_id = $1', [Number(customerId)]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Customer not found' });
            return;
        }
        res.json(result.rows[0]);
    } catch (error: any) {
        console.error('[PROFILE] Error:', error.message);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

router.get('/spending-summary', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const card = await getCustomerCard(req.user!.customer_id);
        console.log('[SPENDING-SUMMARY] Card:', card);
        if (!card) { res.status(404).json({ error: 'Card not found' }); return; }

        const result = await query(`
            SELECT TO_CHAR(transaction_time, 'YYYY-MM') as month, sum(amount) as total
            FROM authorization_transactions
            WHERE card_number_masked = $1
            AND transaction_time >= '2025-07-01' AND transaction_time < '2026-01-01'
            GROUP BY month
            ORDER BY month
        `, [card]);

        const monthsMap: Record<string, string> = {
            '2025-07': 'July',
            '2025-08': 'August',
            '2025-09': 'September',
            '2025-10': 'October',
            '2025-11': 'November',
            '2025-12': 'December'
        };

        const data = result.rows.map(r => ({
            month: monthsMap[r.month] || r.month,
            total: Number(r.total)
        }));
        res.json(data);
    } catch (error: any) {
        console.error('[SPENDING-SUMMARY] Error:', error.message);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

router.get('/category-breakdown', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const card = await getCustomerCard(req.user!.customer_id);
        console.log('[CATEGORY-BREAKDOWN] Card:', card);
        if (!card) { res.status(404).json({ error: 'Card not found' }); return; }

        const result = await query(`
      SELECT COALESCE(m.merchant_category, 'Others') as category, sum(t.amount) as total
      FROM authorization_transactions t
      LEFT JOIN merchants m ON t.merchant_id = m.merchant_id
      WHERE t.card_number_masked = $1
      AND t.transaction_time >= '2025-12-01' AND t.transaction_time < '2026-01-01'
      GROUP BY category
      ORDER BY total DESC
    `, [card]);

        res.json(result.rows.map(r => ({ name: r.category, value: Number(r.total) })));
    } catch (error: any) {
        console.error('[CATEGORY-BREAKDOWN] Error:', error.message);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

router.get('/top-categories', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const card = await getCustomerCard(req.user!.customer_id);
        if (!card) { res.status(404).json({ error: 'Card not found' }); return; }

        const result = await query(`
      SELECT COALESCE(m.merchant_category, 'Others') as category, sum(t.amount) as total
      FROM authorization_transactions t
      LEFT JOIN merchants m ON t.merchant_id = m.merchant_id
      WHERE t.card_number_masked = $1
      AND t.transaction_time >= '2025-12-01' AND t.transaction_time < '2026-01-01'
      GROUP BY category
      ORDER BY total DESC
      LIMIT 3
    `, [card]);

        res.json(result.rows.map(r => ({ name: r.category, value: Number(r.total) })));
    } catch (error: any) {
        console.error('[TOP-CATEGORIES] Error:', error.message);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

router.get('/weekly-spend', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const card = await getCustomerCard(req.user!.customer_id);
        if (!card) { res.status(404).json({ error: 'Card not found' }); return; }

        const result = await query(`
        SELECT 
            CASE 
                WHEN EXTRACT(DAY FROM transaction_time) <= 7 THEN 'Week 1'
                WHEN EXTRACT(DAY FROM transaction_time) <= 14 THEN 'Week 2'
                WHEN EXTRACT(DAY FROM transaction_time) <= 21 THEN 'Week 3'
                ELSE 'Week 4'
            END as week,
            sum(amount) as total
        FROM authorization_transactions
        WHERE card_number_masked = $1
        AND transaction_time >= '2025-12-01' AND transaction_time < '2026-01-01'
        GROUP BY week
        ORDER BY week
    `, [card]);

        res.json(result.rows.map(r => ({ week: r.week, total: Number(r.total) })));
    } catch (error: any) {
        console.error('[WEEKLY-SPEND] Error:', error.message);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

router.get('/largest-transactions', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const card = await getCustomerCard(req.user!.customer_id);
        if (!card) { res.status(404).json({ error: 'Card not found' }); return; }

        const result = await query(`
      SELECT 
        m.merchant_name as merchant,
        t.amount,
        t.transaction_time as date,
        COALESCE(m.merchant_category, 'Others') as category
      FROM authorization_transactions t
      LEFT JOIN merchants m ON t.merchant_id = m.merchant_id
      WHERE t.card_number_masked = $1
      AND t.transaction_time >= '2025-12-01' AND t.transaction_time < '2026-01-01'
      ORDER BY t.amount DESC
      LIMIT 5
    `, [card]);

        res.json(result.rows);
    } catch (error: any) {
        console.error('[LARGEST-TRANSACTIONS] Error:', error.message);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

router.get('/nudges', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const customerId = req.user!.customer_id;
        console.log('[NUDGES] Fetching nudges for customer_id:', customerId);
        const result = await query(`
      SELECT * FROM customer_nudges 
      WHERE customer_id = $1 
      ORDER BY created_at DESC 
      LIMIT 5
    `, [Number(customerId)]);
        res.json(result.rows);
    } catch (error: any) {
        console.error('[NUDGES] Error:', error.message);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

router.get('/merchant-recommendations', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const card = await getCustomerCard(req.user!.customer_id);
        if (!card) { res.status(404).json({ error: 'Card not found' }); return; }

        // Find top spending MCC code first (ignoring nulls)
        const topMccRes = await query(`
            SELECT m.mcc 
            FROM authorization_transactions t
            JOIN merchants m ON t.merchant_id = m.merchant_id
            WHERE t.card_number_masked = $1
            AND t.transaction_time >= '2025-12-01' AND t.transaction_time < '2026-01-01'
            AND m.mcc IS NOT NULL
            GROUP BY m.mcc
            ORDER BY sum(t.amount) DESC
            LIMIT 1
        `, [card]);

        if (topMccRes.rows.length === 0) {
            res.status(404).json({ error: 'No transaction data found to base recommendations on' });
            return;
        }

        const topMcc = topMccRes.rows[0].mcc;

        // Lookup the recommendation matching the top MCC category ID
        const recRes = await query(`
            SELECT merchant_name, category
            FROM merchant_recommendations 
            WHERE category = $1
            LIMIT 1
        `, [topMcc.toString()]);

        // Define a friendly mapping for display since user knows categories not MCCs
        const displayCategoryMap: Record<string, string> = {
            '5311': 'Department Stores',
            '5541': 'Gas Stations',
            '5812': 'Restaurants',
            '5411': 'Grocery Stores',
            '5691': 'Clothing Stores',
            '5732': 'Electronics Stores'
        };

        if (recRes.rows.length === 0) {
            res.json({ category: displayCategoryMap[topMcc] || `Category ${topMcc}`, recommendation: null });
            return;
        }

        res.json({
            category: displayCategoryMap[topMcc] || `Category ${topMcc}`,
            recommendation: recRes.rows[0].merchant_name
        });
    } catch (error: any) {
        console.error('[MERCHANT-RECS] Error:', error.message);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

export default router;
