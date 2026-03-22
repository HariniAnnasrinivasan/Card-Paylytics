const { Pool } = require('pg');
const bcrypt = require('bcrypt');
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
        const hash = await bcrypt.hash('admin123', 10);
        await pool.query('UPDATE saas_users SET password_hash = $1 WHERE email = $2', [hash, 'admin@visabank.com']);
        console.log('Reset admin@visabank.com password to admin123');

        const hash2 = await bcrypt.hash('password', 10);
        await pool.query('UPDATE saas_users SET password_hash = $1 WHERE email = $2', [hash2, 'user@example.com']);
        console.log('Reset user@example.com password to password');
    } catch(e) { console.error(e); }
    pool.end();
}
run();
