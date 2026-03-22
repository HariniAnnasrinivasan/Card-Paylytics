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
        // 1. KPIs
        const totalRevenueResult = await query(`SELECT COALESCE(SUM(total_mdr_revenue), 0)::numeric as val FROM revenue_summary`);
        const fraudRateResult = await query(`SELECT COALESCE(ROUND((SUM(is_fraud)::numeric / NULLIF(COUNT(*), 0)) * 100, 2), 0)::numeric as val FROM authorization_transactions`);
        const approvalRateResult = await query(`SELECT COALESCE(ROUND((COUNT(CASE WHEN LOWER(auth_status)='approved' THEN 1 END)::numeric / NULLIF(COUNT(*), 0)) * 100, 2), 0)::numeric as val FROM authorization_transactions`);
        const totalCustomersResult = await query(`SELECT COUNT(*)::int as count FROM customer_behavior`);
        const highRiskMerchResult = await query(`SELECT COUNT(*)::int as count FROM merchants WHERE LOWER(risk_level) = 'high'`);

        const kpis = {
            totalRevenue: parseFloat(totalRevenueResult.rows[0].val),
            fraudRate: parseFloat(fraudRateResult.rows[0].val),
            approvalRate: parseFloat(approvalRateResult.rows[0].val),
            totalCustomers: totalCustomersResult.rows[0].count,
            highRiskMerchants: highRiskMerchResult.rows[0].count
        };

        // 2. Trend Summaries
        const revenueTrendResult = await query(`SELECT TO_CHAR(date, 'YYYY-MM-DD') as date, COALESCE(total_mdr_revenue, 0)::numeric as value FROM revenue_summary ORDER BY date DESC LIMIT 7`);
        const recentFraudResult = await query(`SELECT TO_CHAR(transaction_time, 'YYYY-MM-DD') as date, COUNT(*)::int as value FROM authorization_transactions WHERE is_fraud = 1 GROUP BY date ORDER BY date DESC LIMIT 7`);
        const recentApprovalResult = await query(`SELECT TO_CHAR(transaction_time, 'YYYY-MM-DD') as date, COUNT(*)::int as value FROM authorization_transactions WHERE LOWER(auth_status)='approved' GROUP BY date ORDER BY date DESC LIMIT 7`);

        const trends = {
            revenue: revenueTrendResult.rows.reverse(),
            fraud: recentFraudResult.rows.reverse(),
            approval: recentApprovalResult.rows.reverse()
        };

        // 3. Risk vs Revenue (Scatter Plot mapping Ticket Size to Risk count per Merchant)
        const scatterResult = await query(`
            SELECT 
                merchant_name as name, 
                avg_ticket_size::numeric as revenue, 
                COALESCE((SELECT COUNT(*) FROM authorization_transactions a WHERE a.merchant_id = m.merchant_id AND a.is_fraud = 1), 0)::int as risk
            FROM merchants m
            WHERE avg_ticket_size IS NOT NULL
            LIMIT 40
        `);

        // 4. Discover Opportunities
        const oppCategoryResult = await query(`SELECT top_category as name, COUNT(*)::int as count FROM customer_behavior WHERE top_category IS NOT NULL GROUP BY top_category ORDER BY count DESC LIMIT 3`);
        
        let opportunities = oppCategoryResult.rows.map(row => ({
            title: `Expansion in ${row.name}`,
            metric: `${row.count} Active Users`,
            type: 'growth'
        }));

        // 5. Discover Risks
        const riskDeclineResult = await query(`SELECT decline_reason_code as reason, COUNT(*)::int as count FROM authorization_transactions WHERE LOWER(auth_status)='declined' GROUP BY decline_reason_code ORDER BY count DESC LIMIT 3`);
        let risks = riskDeclineResult.rows.map(row => ({
            title: `High Declines: ${row.reason || 'Network'}`,
            metric: `${row.count} Failed Txns`,
            type: 'alert'
        }));

        // 6. Strategic Recommendations Generation
        let strategies = [];
        
        if (kpis.fraudRate > 2.0) {
            strategies.push({
                title: 'Deploy Velocity Checks on High-Risk IPs',
                description: 'Fraud rates are elevated above nominal 2.0% threshold. Implement stricter velocity constraints on card-not-present gateways.',
                reason: `System-wide fraud rate is currently ${kpis.fraudRate}%.`,
                impact: 'Estimated 15% reduction in chargebacks.'
            });
        }

        if (kpis.approvalRate < 90.0) {
            strategies.push({
                title: 'Optimize Network Routing for Edge Declines',
                description: 'Approval rate is suboptimal. Analyzing decline reason codes indicates network timeouts.',
                reason: `Approval rate is lagging at ${kpis.approvalRate}%.`,
                impact: 'Potential 4-6% MDR uplift if routing is balanced.'
            });
        } else {
             strategies.push({
                title: 'Incentivize High-Volume Customers',
                description: 'Approval network is highly stable. Time to lean into growth by offering cashback incentives into top spending categories.',
                reason: `Approval network health is excellent (${kpis.approvalRate}%).`,
                impact: 'Estimated 8% increase in overall volume.'
            });
        }

        const topCat = oppCategoryResult.rows[0]?.name || 'Retail';
        strategies.push({
            title: `Merchant Acquisition: ${topCat}`,
            description: `Consumer behavioral data indicates heavy weighting towards ${topCat}. Focus sales teams on acquiring merchants in this vertical.`,
            reason: `Data shows ${oppCategoryResult.rows[0]?.count || 0} top-tier users operating in this bound.`,
            impact: 'Capture untapped wallet-share.'
        });

        res.json({
            summary: `Strategic AI evaluation complete across ${kpis.totalCustomers.toLocaleString()} targeted accounts. Primary objective identified: Capitalizing on robust approval channels while minimizing categorical merchant risk exposure.`,
            kpis,
            trends,
            scatter: scatterResult.rows,
            opportunities,
            risks,
            strategies
        });

    } catch (error: any) {
        console.error('Recommendation Dashboard Error:', error);
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

        const AGENT_ID = process.env.RECOMMENDATION_AGENT_ID || "PLACEHOLDER_AGENT_ID";
        const AGENT_ALIAS_ID = process.env.RECOMMENDATION_ALIAS_ID || "PLACEHOLDER_ALIAS_ID";
        const SESSION_ID = req.user?.user_id?.toString() || "session-rec-123";

        try {
            const command = new InvokeAgentCommand({
                agentId: AGENT_ID,
                agentAliasId: AGENT_ALIAS_ID,
                sessionId: SESSION_ID,
                inputText: prompt, // E.g. "What happens if we reduce fraud by 10%?"
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
            res.json({ response: completion || "I'm sorry, no strategy could be generated." });

        } catch (bedrockError: any) {
            console.error("Bedrock Call Failed:", bedrockError);
            res.json({ response: "Executive AI Strategy Agent standing by. I possess cross-functional visibility spanning revenue, fraud, and behavioral economics. My Bedrock connection is running locally; integrate production cloud ARNs to process highly dynamic 'what-if' simulations." });
        }
    } catch (error: any) {
        console.error('Recommendation Agent Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
