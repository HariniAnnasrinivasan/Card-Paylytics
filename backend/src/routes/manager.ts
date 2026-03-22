import { Router, Response } from 'express';
import { query } from '../db';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(requireAuth);

// Role guard – managers only
router.use((req: AuthRequest, res: Response, next: any) => {
    if (req.user?.role !== 'manager') {
        res.status(403).json({ error: 'Forbidden: Manager access only' });
        return;
    }
    next();
});

router.get('/dashboard', async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        // ── A. KPI SUMMARY ────────────────────────────────────────────────────
        const [
            customersRes,
            merchantsRes,
            transactionsRes,
            revenueRes,
            fraudRes
        ] = await Promise.all([
            query('SELECT COUNT(*) FROM customer_behavior'),
            query('SELECT COUNT(*) FROM merchants'),
            query('SELECT COUNT(*) FROM authorization_transactions'),
            query('SELECT COALESCE(SUM(total_mdr_revenue), 0) AS total FROM revenue_summary'),
            query('SELECT COUNT(*) FROM fraud_events')
        ]);

        const kpis = {
            totalCustomers: parseInt(customersRes.rows[0].count),
            totalMerchants: parseInt(merchantsRes.rows[0].count),
            totalTransactions: parseInt(transactionsRes.rows[0].count),
            totalRevenue: parseFloat(revenueRes.rows[0].total),
            totalFraud: parseInt(fraudRes.rows[0].count)
        };

        // ── B. REVENUE TREND (last 12 months) ─────────────────────────────────
        const revenueTrendRes = await query(`
            SELECT 
                TO_CHAR(date, 'YYYY-MM') AS month,
                SUM(total_mdr_revenue) AS revenue
            FROM revenue_summary
            WHERE date >= NOW() - INTERVAL '12 months'
            GROUP BY month
            ORDER BY month ASC
        `);
        const revenueTrend = revenueTrendRes.rows.map(r => ({
            month: r.month,
            revenue: parseFloat(r.revenue)
        }));

        // ── C. TRANSACTION VOLUME BY CATEGORY ────────────────────────────────
        const txnByCategoryRes = await query(`
            SELECT 
                COALESCE(m.merchant_category, 'Others') AS category,
                COUNT(*) AS count
            FROM authorization_transactions t
            LEFT JOIN merchants m ON t.merchant_id = m.merchant_id
            GROUP BY category
            ORDER BY count DESC
            LIMIT 10
        `);
        const txnByCategory = txnByCategoryRes.rows.map(r => ({
            category: r.category,
            count: parseInt(r.count)
        }));

        // ── D. FRAUD OVERVIEW ─────────────────────────────────────────────────
        const fraudOverviewRes = await query(`
            SELECT 
                COALESCE(fraud_type, 'Unknown') AS fraud_type,
                COUNT(*) AS count
            FROM fraud_events
            GROUP BY fraud_type
            ORDER BY count DESC
        `);
        const fraudOverview = fraudOverviewRes.rows.map(r => ({
            fraud_type: r.fraud_type,
            count: parseInt(r.count)
        }));

        // ── E. CUSTOMER SEGMENT DISTRIBUTION ─────────────────────────────────
        const customerSegmentsRes = await query(`
            SELECT 
                COALESCE(segment, 'Unknown') AS segment,
                COUNT(*) AS count
            FROM customer_behavior
            GROUP BY segment
            ORDER BY count DESC
        `);
        const customerSegments = customerSegmentsRes.rows.map(r => ({
            segment: r.segment,
            count: parseInt(r.count)
        }));

        // ── F. APPROVAL VS DECLINE ────────────────────────────────────────────
        const approvalDeclineRes = await query(`
            SELECT 
                COALESCE(auth_status, 'Unknown') AS status,
                COUNT(*) AS count
            FROM authorization_transactions
            GROUP BY auth_status
            ORDER BY count DESC
        `);
        const approvalDecline = approvalDeclineRes.rows.map(r => ({
            status: r.status,
            count: parseInt(r.count)
        }));

        // ── G. TOP MERCHANT CATEGORIES ────────────────────────────────────────
        const topMerchantsRes = await query(`
            SELECT 
                COALESCE(merchant_category, 'Others') AS category,
                ROUND(AVG(avg_ticket_size)::numeric, 2) AS avg_ticket_size,
                COUNT(*) AS merchant_count
            FROM merchants
            GROUP BY category
            ORDER BY avg_ticket_size DESC
            LIMIT 10
        `);
        const topMerchants = topMerchantsRes.rows.map(r => ({
            category: r.category,
            avg_ticket_size: parseFloat(r.avg_ticket_size),
            merchant_count: parseInt(r.merchant_count)
        }));

        res.json({
            kpis,
            revenueTrend,
            txnByCategory,
            fraudOverview,
            customerSegments,
            approvalDecline,
            topMerchants
        });

    } catch (error: any) {
        console.error('[MANAGER-DASHBOARD] Error:', error.message);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

export default router;
