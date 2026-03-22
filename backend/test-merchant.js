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
        const res = await client.query("SELECT risk_level, COUNT(*) FROM merchants GROUP BY risk_level");
        console.log("Risk levels:", res.rows);
    } catch (e) {
        console.error(e);
    } finally {
        client.end();
    }
});
