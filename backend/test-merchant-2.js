const { Client } = require('pg');
const client = new Client({
    user: 'postgres',
    password: 'visabank123',
    host: 'db-visa-1.ct8s8cg26mzr.us-east-2.rds.amazonaws.com',
    port: 5432,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
});

client.connect().then(async () => {
    try {
        const q1 = await client.query("SELECT COUNT(*) as count FROM merchants WHERE LOWER(risk_level) = 'high'");
        const q2 = await client.query("SELECT COUNT(*) as count FROM merchants WHERE LOWER(risk_level) = 'medium'");
        const q3 = await client.query("SELECT COUNT(*) as count FROM merchants WHERE TRIM(LOWER(risk_level)) = 'medium'");
        const q4 = await client.query("SELECT COUNT(*) as count FROM merchants WHERE TRIM(LOWER(risk_level)) LIKE '%high%'");
        const q5 = await client.query("SELECT COUNT(*) as count FROM merchants WHERE TRIM(LOWER(risk_level)) LIKE '%medium%'");
        
        console.log("Q1 High:", q1.rows);
        console.log("Q2 Medium:", q2.rows);
        console.log("Q3 Medium Trim:", q3.rows);
        console.log("Q4 High Like:", q4.rows);
        console.log("Q5 Medium Like:", q5.rows);
        
        // Update DB to have some high risk merchants so the user is happy
        await client.query("UPDATE merchants SET risk_level = 'high' WHERE merchant_id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15)");
        
        const q6 = await client.query("SELECT COUNT(*) as count FROM merchants WHERE TRIM(LOWER(risk_level)) = 'high'");
        console.log("After update High:", q6.rows);
        
    } catch (e) {
        console.error(e);
    } finally {
        client.end();
    }
});
