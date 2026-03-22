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
        const totalCustomersQuery = `SELECT COUNT(*)::int as count FROM customer_behavior`;
        const avgMonthlySpendQuery = `SELECT COALESCE(AVG(avg_monthly_spend), 0)::numeric as avg FROM customer_behavior`;
        const highValueCountQuery = `SELECT COUNT(*)::int as count FROM customer_behavior WHERE avg_monthly_spend > 5000`;
        const mostCommonSegmentQuery = `SELECT CAST(MODE() WITHIN GROUP (ORDER BY segment) AS VARCHAR) as mode FROM customer_behavior`;

        // Charts
        const ageDistQuery = `
            SELECT age, COUNT(*)::int as count
            FROM customer_behavior
            WHERE age IS NOT NULL
            GROUP BY age
            ORDER BY age
        `;
        const genderDistQuery = `
            SELECT gender, COUNT(*)::int as count
            FROM customer_behavior
            WHERE gender IS NOT NULL
            GROUP BY gender
        `;
        const segmentDistQuery = `
            SELECT segment, COUNT(*)::int as count
            FROM customer_behavior
            WHERE segment IS NOT NULL
            GROUP BY segment
        `;
        const topSpendingCatsQuery = `
            SELECT top_category, COUNT(*)::int as count
            FROM customer_behavior
            WHERE top_category IS NOT NULL
            GROUP BY top_category
            ORDER BY count DESC
            LIMIT 10
        `;
        const incomeDistQuery = `
            SELECT income_bracket, COUNT(*)::int as count
            FROM customer_behavior
            WHERE income_bracket IS NOT NULL
            GROUP BY income_bracket
        `;
        const cityDistQuery = `
            SELECT city, COUNT(*)::int as count
            FROM customer_behavior
            WHERE city IS NOT NULL
            GROUP BY city
            ORDER BY count DESC
            LIMIT 10
        `;
        const stateDistQuery = `
            SELECT state, COUNT(*)::int as count
            FROM customer_behavior
            WHERE state IS NOT NULL
            GROUP BY state
            ORDER BY count DESC
            LIMIT 10
        `;
        const spendingPatternQuery = `
            SELECT spending_pattern, COUNT(*)::int as count
            FROM customer_behavior
            WHERE spending_pattern IS NOT NULL
            GROUP BY spending_pattern
        `;
        const highValueTableQuery = `
            SELECT customer_id, first_name, last_name, avg_monthly_spend, segment, city
            FROM customer_behavior
            ORDER BY avg_monthly_spend DESC
            LIMIT 10
        `;

        const [
            kpiTotal, kpiAvg, kpiHighValue, kpiSegment,
            chartAge, chartGender, chartSegment, chartTopCategory, chartIncome, chartCity, chartState, chartPattern, tblHighValue
        ] = await Promise.all([
            query(totalCustomersQuery), query(avgMonthlySpendQuery), query(highValueCountQuery), query(mostCommonSegmentQuery),
            query(ageDistQuery), query(genderDistQuery), query(segmentDistQuery), query(topSpendingCatsQuery), query(incomeDistQuery), query(cityDistQuery), query(stateDistQuery), query(spendingPatternQuery), query(highValueTableQuery)
        ]);

        res.json({
            kpis: {
                totalCustomers: kpiTotal.rows[0].count,
                averageMonthlySpend: parseFloat(kpiAvg.rows[0].avg).toFixed(2),
                highValueCustomers: kpiHighValue.rows[0].count,
                mostCommonSegment: kpiSegment.rows[0].mode || 'N/A'
            },
            charts: {
                ageDistribution: chartAge.rows,
                genderDistribution: chartGender.rows,
                segmentDistribution: chartSegment.rows,
                topCategories: chartTopCategory.rows,
                incomeDistribution: chartIncome.rows,
                cityDistribution: chartCity.rows,
                stateDistribution: chartState.rows,
                spendingPattern: chartPattern.rows
            },
            tables: {
                highValueCustomers: tblHighValue.rows.map((row: any) => ({
                    ...row,
                    avg_monthly_spend: parseFloat(row.avg_monthly_spend)
                }))
            }
        });
    } catch (error: any) {
        console.error('Customer Insights Dashboard Error:', error);
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

        const AGENT_ID = process.env.CUSTOMER_AGENT_ID || "PLACEHOLDER_AGENT_ID";
        const AGENT_ALIAS_ID = process.env.CUSTOMER_AGENT_ALIAS_ID || "PLACEHOLDER_ALIAS_ID";
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
            res.json({ response: "I am the Customer Intelligence Agent. My AWS Bedrock connection is currently using placeholder IDs, but once configured, I can analyze demographics, behavioral spending blocks, and macro-financial statistics across your tenant-base." });
        }
    } catch (error: any) {
        console.error('Customer Agent Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
