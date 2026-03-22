import { Router, Response } from 'express';
import { query } from '../db';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";

const router = Router();

// Apply auth to all routes
router.use(requireAuth);

/**
 * GET /api/revenue/dashboard
 * Aggregates revenue summary data and time-series for charts
 */
router.get('/dashboard', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const kpisQuery = `
            SELECT 
                COALESCE(SUM(total_mdr_revenue), 0) as total_mdr,
                COALESCE(SUM(issuer_revenue), 0) as total_issuer,
                COALESCE(SUM(acquirer_revenue), 0) as total_acquirer,
                COALESCE(SUM(interchange_cost), 0) as total_interchange
            FROM revenue_summary
        `;
        
        const chartsQuery = `
            SELECT 
                TO_CHAR(date, 'YYYY-MM-DD') as date,
                total_mdr_revenue,
                issuer_revenue,
                acquirer_revenue,
                interchange_cost,
                network_fee_paid,
                fuel_surcharge_recovery,
                crossborder_revenue,
                (total_mdr_revenue - interchange_cost - network_fee_paid) as profit
            FROM revenue_summary
            ORDER BY date ASC
        `;

        const [kpisRes, chartsRes] = await Promise.all([
            query(kpisQuery),
            query(chartsQuery)
        ]);

        res.json({
            kpis: kpisRes.rows[0],
            charts: chartsRes.rows.map(row => ({
                ...row,
                total_mdr_revenue: parseFloat(row.total_mdr_revenue),
                issuer_revenue: parseFloat(row.issuer_revenue),
                acquirer_revenue: parseFloat(row.acquirer_revenue),
                interchange_cost: parseFloat(row.interchange_cost),
                network_fee_paid: parseFloat(row.network_fee_paid),
                fuel_surcharge_recovery: parseFloat(row.fuel_surcharge_recovery),
                crossborder_revenue: parseFloat(row.crossborder_revenue),
                profit: parseFloat(row.profit)
            }))
        });
    } catch (error: any) {
        console.error('[REVENUE-DASHBOARD] Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

/**
 * POST /api/revenue/agent
 * Forwards user queries to AWS Bedrock Agent
 */
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
        const command = new InvokeAgentCommand({
            agentId: process.env.REVENUE_AGENT_ID || "OEVFACIPUT",
            agentAliasId: process.env.REVENUE_AGENT_ALIAS_ID || "CCBVLRWLAK",
            sessionId: `session-${req.user?.user_id || 'guest'}`,
            inputText: prompt,
        });

        const response = await bedrockClient.send(command);
        let completion = "";

        if (response.completion) {
            for await (const chunk of response.completion) {
                if (chunk.chunk && chunk.chunk.bytes) {
                    const text = new TextDecoder("utf-8").decode(chunk.chunk.bytes);
                    completion += text;
                }
            }
        }

        res.json({ response: completion || "I couldn't generate a response at this time." });
    } catch (error: any) {
        console.error('[REVENUE-AGENT] Error:', error.message);
        res.status(500).json({ error: 'Error calling AI Agent', details: error.message });
    }
});

export default router;
