import { Router, Response } from 'express';
import { query } from '../db';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";

const router = Router();
router.use(requireAuth);

router.get('/dashboard', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // KPI Queries
        const totalTxnQuery = `SELECT COUNT(*)::int as count FROM authorization_transactions`;
        const approvalRateQuery = `
            SELECT 
                COALESCE((SUM(CASE WHEN LOWER(auth_status) = 'approved' THEN 1 ELSE 0 END)::float / NULLIF(COUNT(*), 0)) * 100, 0) as rate
            FROM authorization_transactions
        `;
        const declineRateQuery = `
            SELECT 
                COALESCE((SUM(CASE WHEN LOWER(auth_status) = 'declined' THEN 1 ELSE 0 END)::float / NULLIF(COUNT(*), 0)) * 100, 0) as rate
            FROM authorization_transactions
        `;
        const highValueCountQuery = `SELECT COUNT(*)::int as count FROM authorization_transactions WHERE amount > 1000`;

        // Chart Queries
        const approvalVsDeclineQuery = `
            SELECT INITCAP(auth_status) as auth_status, COUNT(*)::int as count
            FROM authorization_transactions
            GROUP BY auth_status
        `;
        const declineReasonQuery = `
            SELECT 
                CASE decline_reason_code
                    WHEN '05' THEN '05 - Do Not Honor'
                    WHEN '12' THEN '12 - Invalid Transaction'
                    WHEN '14' THEN '14 - Invalid Card Number'
                    WHEN '51' THEN '51 - Insufficient Funds'
                    WHEN '54' THEN '54 - Expired Card'
                    WHEN '55' THEN '55 - Incorrect PIN'
                    WHEN '57' THEN '57 - Not Permitted'
                    WHEN '61' THEN '61 - Exceeds Limit'
                    ELSE decline_reason_code || ' - Other'
                END as decline_reason_code, 
                COUNT(*)::int as count
            FROM authorization_transactions
            WHERE LOWER(auth_status) = 'declined'
            GROUP BY 1
        `;
        const channelUsageQuery = `
            SELECT channel, COUNT(*)::int as count
            FROM authorization_transactions
            GROUP BY channel
        `;
        const txnTrendQuery = `
            SELECT TO_CHAR(transaction_time, 'YYYY-MM-DD') as date, COUNT(*)::int as count
            FROM authorization_transactions
            GROUP BY date
            ORDER BY date
        `;
        const highValueTrendQuery = `
            SELECT TO_CHAR(transaction_time, 'YYYY-MM-DD') as date, SUM(amount) as total_amount
            FROM authorization_transactions
            WHERE amount > 1000
            GROUP BY date
            ORDER BY date
        `;
        const issuerPerfQuery = `
            SELECT issuer_bank, COUNT(*)::int as count
            FROM authorization_transactions
            GROUP BY issuer_bank
        `;

        const [
            kpiTotal, kpiApprove, kpiDecline, kpiHighValue,
            chartApproveDecline, chartDeclineReason, chartChannel, chartTxnTrend, chartHighValue, chartIssuer
        ] = await Promise.all([
            query(totalTxnQuery), query(approvalRateQuery), query(declineRateQuery), query(highValueCountQuery),
            query(approvalVsDeclineQuery), query(declineReasonQuery), query(channelUsageQuery), query(txnTrendQuery), query(highValueTrendQuery), query(issuerPerfQuery)
        ]);

        res.json({
            kpis: {
                totalTransactions: kpiTotal.rows[0].count,
                approvalRate: parseFloat(kpiApprove.rows[0].rate).toFixed(2),
                declineRate: parseFloat(kpiDecline.rows[0].rate).toFixed(2),
                highValueTransactions: kpiHighValue.rows[0].count
            },
            charts: {
                approvalDecline: chartApproveDecline.rows,
                declineReasons: chartDeclineReason.rows,
                channelUsage: chartChannel.rows,
                transactionTrend: chartTxnTrend.rows,
                highValueTrend: chartHighValue.rows,
                issuerPerformance: chartIssuer.rows
            }
        });
    } catch (error: any) {
        console.error('[AUTH-DASHBOARD] Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const bedrockClient = new BedrockAgentRuntimeClient({ 
    region: process.env.AWS_REGION || "us-east-2",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
    }
});

router.post('/agent', async (req: AuthRequest, res: Response): Promise<void> => {
    const { prompt } = req.body;

    if (!prompt) {
        res.status(400).json({ error: "Prompt is required" });
        return;
    }

    try {
        const AGENT_ID = process.env.AUTHORIZATION_AGENT_ID || "AUTH_AGENT_PLACEHOLDER";
        const ALIAS_ID = process.env.AUTHORIZATION_AGENT_ALIAS_ID || "AUTH_ALIAS_PLACEHOLDER";
        const SESSION_ID = req.user?.user_id?.toString() || "session-auth-123";

        const command = new InvokeAgentCommand({
            agentId: AGENT_ID,
            agentAliasId: ALIAS_ID,
            sessionId: SESSION_ID,
            inputText: prompt, // E.g. "Why are there so many declined transactions?"
        });

        const response = await bedrockClient.send(command);
        
        let completion = "";
        if (response.completion) {
            for await (const chunk of response.completion) {
                if (chunk.chunk?.bytes) {
                    completion += new TextDecoder().decode(chunk.chunk.bytes);
                }
            }
        }
        res.json({ response: completion || "I'm sorry, no response could be generated." });
    } catch (error: any) {
        console.error('[AUTH-AGENT] Error:', error.message);
        res.status(500).json({ error: 'Error calling AI Agent' });
    }
});

export default router;
