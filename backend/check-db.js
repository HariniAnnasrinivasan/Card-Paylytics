const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        const declineReasons = await pool.query('SELECT DISTINCT decline_reason_code FROM authorization_transactions WHERE LOWER(auth_status) = \'declined\'');
        console.log('Reason Codes:', declineReasons.rows.map(r => r.decline_reason_code));
    } catch(e) { console.error(e); }
    pool.end();
}
run();
