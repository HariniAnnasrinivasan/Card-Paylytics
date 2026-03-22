import { query } from './src/db';

async function test() {
    try {
        const [
            merchantsResult,
            avgTicketResult,
            highRiskResult,
            medRiskResult,
            categoryResult,
            ticketByCategoryResult,
            riskDistributionResult,
            geoResult,
            topRiskyResult
        ] = await Promise.all([
            query('SELECT COUNT(*) as total FROM merchants', []),
            query('SELECT AVG(avg_ticket_size) as avg_ticket FROM merchants', []),
            query("SELECT COUNT(*) as count FROM merchants WHERE LOWER(risk_level) = 'high'", []),
            query("SELECT COUNT(*) as count FROM merchants WHERE LOWER(risk_level) = 'medium'", []),
            query('SELECT merchant_category, COUNT(*) as count FROM merchants GROUP BY merchant_category ORDER BY count DESC', []),
            query('SELECT merchant_category, AVG(avg_ticket_size) as avg_ticket FROM merchants GROUP BY merchant_category ORDER BY avg_ticket DESC', []),
            query('SELECT risk_level, COUNT(*) as count FROM merchants GROUP BY risk_level', []),
            query('SELECT state, COUNT(*) as count FROM merchants GROUP BY state ORDER BY count DESC LIMIT 8', []),
            query("SELECT merchant_name, merchant_category, avg_ticket_size FROM merchants WHERE LOWER(risk_level) = 'high' ORDER BY avg_ticket_size DESC LIMIT 10", [])
        ]);

        const kpis = {
            totalMerchants: parseInt(merchantsResult.rows[0]?.total || '0', 10),
            avgTicketSize: parseFloat(avgTicketResult.rows[0]?.avg_ticket || '0'),
            highRisk: parseInt(highRiskResult.rows[0]?.count || '0', 10),
            mediumRisk: parseInt(medRiskResult.rows[0]?.count || '0', 10)
        };

        console.log("KPIS calculated:", kpis);
        console.log("High Risk Table:", topRiskyResult.rows);

    } catch (e) {
        console.error("Error:", e);
    }
}
test();
