import { Router, Response } from 'express';
import { query } from '../db';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";

const router = Router();
const client = new BedrockAgentRuntimeClient({ 
    region: process.env.AWS_REGION || "us-east-2",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
    }
});

// GET /api/merchant/dashboard
router.get('/dashboard', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
        // Run aggregations concurrently
        const [
            merchantsResult,
            avgTicketResult,
            highRiskResult,
            medRiskResult,
            categoryResult,
            ticketByCategoryResult,
            riskDistributionResult,
            geoResult,
            topRiskyResult,
            potentialPartnersResult
        ] = await Promise.all([
            query('SELECT COUNT(*) as total FROM merchants', []),
            query('SELECT AVG(avg_ticket_size) as avg_ticket FROM merchants', []),
            query("SELECT COUNT(*) as count FROM merchants WHERE LOWER(risk_level) = 'high'", []),
            query("SELECT COUNT(*) as count FROM merchants WHERE LOWER(risk_level) = 'medium'", []),
            query('SELECT merchant_category, COUNT(*) as count FROM merchants GROUP BY merchant_category ORDER BY count DESC', []),
            query('SELECT merchant_category, AVG(avg_ticket_size) as avg_ticket FROM merchants GROUP BY merchant_category ORDER BY avg_ticket DESC', []),
            query('SELECT LOWER(risk_level) as risk_level, COUNT(*) as count FROM merchants GROUP BY LOWER(risk_level)', []),
            query('SELECT state, COUNT(*) as count FROM merchants GROUP BY state ORDER BY count DESC LIMIT 8', []),
            query("SELECT merchant_name, merchant_category, avg_ticket_size FROM merchants WHERE LOWER(risk_level) = 'high' ORDER BY avg_ticket_size DESC LIMIT 10", []),
            query("SELECT merchant_name, merchant_category, avg_ticket_size, ROUND(avg_ticket_size * 0.05, 2) AS potential_discount, ROUND(avg_ticket_size * 50, 2) AS estimated_revenue_impact FROM merchants WHERE LOWER(risk_level) != 'high' ORDER BY avg_ticket_size DESC LIMIT 5", [])
        ]);

        const kpis = {
            totalMerchants: parseInt(merchantsResult.rows[0]?.total || '0', 10),
            avgTicketSize: parseFloat(avgTicketResult.rows[0]?.avg_ticket || '0'),
            highRisk: parseInt(highRiskResult.rows[0]?.count || '0', 10),
            mediumRisk: parseInt(medRiskResult.rows[0]?.count || '0', 10)
        };

        const charts = {
            categoryDistribution: categoryResult.rows.map(row => ({
                category: row.merchant_category,
                count: parseInt(row.count, 10)
            })),
            ticketSizeByCategory: ticketByCategoryResult.rows.map(row => ({
                category: row.merchant_category,
                avg_ticket: parseFloat(row.avg_ticket)
            })),
            riskDistribution: riskDistributionResult.rows.map(row => ({
                risk_level: row.risk_level,
                value: parseInt(row.count, 10)
            })),
            geographicSpread: geoResult.rows.map(row => ({
                state: row.state || 'Unknown',
                count: parseInt(row.count, 10)
            })),
            topHighRisk: topRiskyResult.rows,
            potentialPartners: potentialPartnersResult.rows
        };

        res.json({ kpis, charts });
    } catch (error) {
        console.error('Merchant dashboard error:', error);
        res.status(500).json({ error: 'Failed to fetch merchant data' });
    }
});

// POST /api/merchant/agent
router.post('/agent', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const agentId = process.env.MERCHANT_AGENT_ID || "OEVFACIPUT"; // Using same placeholder as Revenue
        const agentAliasId = process.env.MERCHANT_AGENT_ALIAS_ID || "CCBVLRWLAK";
        const sessionId = req.user?.user_id ? `merchant-user-${req.user.user_id}` : "merchant-guest-session";

        const command = new InvokeAgentCommand({
            agentId,
            agentAliasId,
            sessionId,
            inputText: prompt,
        });

        const response = await client.send(command);
        let completion = "";

        if (response.completion) {
            for await (const chunk of response.completion) {
                if (chunk.chunk && chunk.chunk.bytes) {
                    completion += new TextDecoder("utf-8").decode(chunk.chunk.bytes);
                }
            }
        }

        res.json({ response: completion || "No response received from the agent." });
    } catch (error) {
        console.error('Merchant Agent Error:', error);
        // Fallback for missing Bedrock access or unconfigured agent IDs
        res.json({ 
            response: "I'm the Merchant Intelligence Agent. My AI backend is currently running in simulation mode. I can analyze risks and categorizations once AWS Bedrock is fully provisioned." 
        });
    }
});

export default router;
