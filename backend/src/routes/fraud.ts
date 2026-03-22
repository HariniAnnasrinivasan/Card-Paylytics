import { Router, Response } from 'express';
import { query } from '../db';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";

const router = Router();

// Apply auth to all routes
router.use(requireAuth);

/**
 * GET /api/fraud/dashboard
 * Aggregates fraud data for the dashboard
 */
router.get('/dashboard', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // 1. KPI Queries
        const totalFraudQuery = `SELECT COUNT(*) as count FROM fraud_events`;
        const fraudRateQuery = `
            SELECT 
                (SELECT COUNT(*)::float FROM fraud_events) / 
                NULLIF((SELECT COUNT(*) FROM authorization_transactions), 0) * 100 as rate
        `;
        const highRiskQuery = `SELECT COUNT(*) as count FROM authorization_transactions WHERE fraud_risk_score > 70`;
        const locationMismatchQuery = `SELECT COUNT(*) as count FROM fraud_events WHERE location_mismatch = true`;

        // 2. Chart Queries
        const trendQuery = `
            SELECT TO_CHAR(detected_time, 'YYYY-MM-DD') as date, COUNT(*) as count 
            FROM fraud_events 
            GROUP BY date 
            ORDER BY date
        `;
        const typeDistQuery = `SELECT fraud_type as name, COUNT(*) as value FROM fraud_events GROUP BY fraud_type`;
        const riskScoreQuery = `
            SELECT 
                CASE 
                    WHEN fraud_risk_score <= 30 THEN 'Low' 
                    WHEN fraud_risk_score <= 70 THEN 'Medium' 
                    ELSE 'High' 
                END as risk_level, 
                COUNT(*) as count 
            FROM authorization_transactions 
            WHERE is_fraud = 1 
            GROUP BY risk_level
        `;
        const geoQuery = `SELECT location_mismatch, COUNT(*) as count FROM fraud_events GROUP BY location_mismatch`;
        const timeOfDayQuery = `
            SELECT EXTRACT(HOUR FROM detected_time) as hour, COUNT(*) as count 
            FROM fraud_events 
            GROUP BY hour 
            ORDER BY hour
        `;
        const topMerchantsQuery = `
            SELECT m.merchant_id, m.merchant_name, COUNT(fe.fraud_id) as fraud_count 
            FROM fraud_events fe 
            JOIN authorization_transactions at ON fe.auth_id = at.auth_id 
            JOIN merchants m ON at.merchant_id = m.merchant_id 
            GROUP BY m.merchant_id, m.merchant_name 
            ORDER BY fraud_count DESC 
            LIMIT 5
        `;

        const [
            totalRes, rateRes, highRes, geoMismatchRes,
            trendRes, typeRes, riskRes, geoChartRes, timeRes, merchantsRes
        ] = await Promise.all([
            query(totalFraudQuery), query(fraudRateQuery), query(highRiskQuery), query(locationMismatchQuery),
            query(trendQuery), query(typeDistQuery), query(riskScoreQuery), query(geoQuery), query(timeOfDayQuery), query(topMerchantsQuery)
        ]);

        res.json({
            kpis: {
                totalFraud: parseInt(totalRes.rows[0].count),
                fraudRate: parseFloat(rateRes.rows[0].rate || 0).toFixed(2),
                highRisk: parseInt(highRes.rows[0].count),
                locationMismatch: parseInt(geoMismatchRes.rows[0].count)
            },
            charts: {
                trend: trendRes.rows,
                distribution: typeRes.rows,
                riskSegmentation: riskRes.rows,
                geoAnalysis: geoChartRes.rows,
                timeOfDay: timeRes.rows,
                topMerchants: merchantsRes.rows
            }
        });
    } catch (error: any) {
        console.error('[FRAUD-DASHBOARD] Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * POST /api/fraud/agent
 * AI integration with placeholder IDs
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
        const AGENT_ID = process.env.FRAUD_AGENT_ID || "FRAUD_AGENT_TBA";
        const ALIAS_ID = process.env.FRAUD_AGENT_ALIAS_ID || "FRAUD_ALIAS_TBA";
        const SESSION_ID = req.user?.user_id?.toString() || "session-fraud-123";

        const command = new InvokeAgentCommand({
            agentId: AGENT_ID,
            agentAliasId: ALIAS_ID,
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
        res.json({ response: completion || "I'm sorry, no response could be generated." });
    } catch (error: any) {
        console.error('[FRAUD-AGENT] Error:', error.message);
        res.status(500).json({ error: 'Error calling AI Agent' });
    }
});

export default router;
