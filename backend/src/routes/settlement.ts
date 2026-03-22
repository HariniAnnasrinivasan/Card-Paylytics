import { Router, Response } from 'express';
import { query } from '../db';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";

const router = Router();

const bedrockClient = new BedrockAgentRuntimeClient({ 
    region: process.env.AWS_REGION || "us-east-2",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
    }
});

router.get('/dashboard', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // KPIs
        const totalSettledQuery = `SELECT COALESCE(SUM(settlement_amount), 0) as total FROM settlement_transactions`;
        const successCountQuery = `SELECT COUNT(*)::int as count FROM settlement_transactions WHERE LOWER(settlement_status) = 'success'`;
        const pendingCountQuery = `SELECT COUNT(*)::int as count FROM settlement_transactions WHERE LOWER(settlement_status) = 'pending'`;
        const totalFeesQuery = `SELECT COALESCE(SUM(issuer_fee + acquirer_fee + network_fee), 0) as total FROM settlement_transactions`;

        // Charts
        const trendQuery = `
            SELECT TO_CHAR(settlement_date, 'YYYY-MM-DD') as date, COALESCE(SUM(settlement_amount), 0) as amount
            FROM settlement_transactions
            GROUP BY date
            ORDER BY date
        `;
        const statusQuery = `
            SELECT INITCAP(settlement_status) as status, COUNT(*)::int as count
            FROM settlement_transactions
            GROUP BY settlement_status
        `;
        const feeBreakdownQuery = `
            SELECT 
                TO_CHAR(settlement_date, 'YYYY-MM-DD') as date,
                COALESCE(SUM(issuer_fee), 0) as issuer_fee,
                COALESCE(SUM(acquirer_fee), 0) as acquirer_fee,
                COALESCE(SUM(network_fee), 0) as network_fee
            FROM settlement_transactions
            GROUP BY date
            ORDER BY date
        `;
        const interchangeTrendQuery = `
            SELECT TO_CHAR(settlement_date, 'YYYY-MM-DD') as date, COALESCE(SUM(interchange_fee), 0) as amount
            FROM settlement_transactions
            GROUP BY date
            ORDER BY date
        `;
        const delayAnalysisQuery = `
            SELECT 
                CASE 
                    WHEN DATE(s.settlement_date) = DATE(a.transaction_time) THEN 'Same Day'
                    WHEN DATE(s.settlement_date) = DATE(a.transaction_time) + INTERVAL '1 day' THEN '1 Day'
                    ELSE '2+ Days'
                END as delay_bucket,
                COUNT(*)::int as count
            FROM settlement_transactions s
            JOIN authorization_transactions a ON s.auth_id = a.auth_id
            GROUP BY 1
        `;
        const highValueQuery = `
            SELECT settlement_amount, TO_CHAR(settlement_date, 'YYYY-MM-DD') as date, auth_id, settlement_status
            FROM settlement_transactions
            ORDER BY settlement_amount DESC
            LIMIT 10
        `;

        const [
            kpiTotal, kpiSuccess, kpiPending, kpiFees,
            chartTrend, chartStatus, chartFees, chartInterchange, chartDelay, tblHighValue
        ] = await Promise.all([
            query(totalSettledQuery), query(successCountQuery), query(pendingCountQuery), query(totalFeesQuery),
            query(trendQuery), query(statusQuery), query(feeBreakdownQuery), query(interchangeTrendQuery), query(delayAnalysisQuery), query(highValueQuery)
        ]);

        res.json({
            kpis: {
                totalSettled: parseFloat(kpiTotal.rows[0].total),
                successful: kpiSuccess.rows[0].count,
                pending: kpiPending.rows[0].count,
                totalFees: parseFloat(kpiFees.rows[0].total)
            },
            charts: {
                trend: chartTrend.rows.map((row: any) => ({ date: row.date, amount: parseFloat(row.amount) })),
                status: chartStatus.rows,
                feeBreakdown: chartFees.rows.map((row: any) => ({
                    date: row.date,
                    issuer_fee: parseFloat(row.issuer_fee),
                    acquirer_fee: parseFloat(row.acquirer_fee),
                    network_fee: parseFloat(row.network_fee)
                })),
                interchange: chartInterchange.rows.map((row: any) => ({ date: row.date, amount: parseFloat(row.amount) })),
                delay: chartDelay.rows
            },
            tables: {
                highValue: tblHighValue.rows.map((row: any) => ({
                    ...row,
                    settlement_amount: parseFloat(row.settlement_amount)
                }))
            }
        });
    } catch (error: any) {
        console.error('Settlement Dashboard Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/agent', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            res.status(400).json({ error: 'Prompt is required' });
            return;
        }

        const AGENT_ID = process.env.SETTLEMENT_AGENT_ID || "PLACEHOLDER_AGENT_ID";
        const AGENT_ALIAS_ID = process.env.SETTLEMENT_ALIAS_ID || "PLACEHOLDER_ALIAS_ID";
        const SESSION_ID = req.user?.user_id?.toString() || "session-123";

        try {
            const command = new InvokeAgentCommand({
                agentId: AGENT_ID,
                agentAliasId: AGENT_ALIAS_ID,
                sessionId: SESSION_ID,
                inputText: prompt,
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

            res.json({ response: completion || "I'm sorry, I couldn't generate a response." });

        } catch (bedrockError: any) {
            console.error("Bedrock Call Failed:", bedrockError);
            res.json({ response: "I am the Settlement Intelligence Agent. My AWS Bedrock connection is currently using placeholder IDs, but once configured, I can analyze settlement trends, detect fee anomalies, and investigate interchange cost drivers based on your actual data." });
        }
    } catch (error: any) {
        console.error('Settlement Agent Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
