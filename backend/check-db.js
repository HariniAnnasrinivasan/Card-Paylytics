const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
    user: process.env.DB_USER, host: process.env.DB_HOST, database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD, port: parseInt(process.env.DB_PORT || '5432'),
    ssl: { rejectUnauthorized: false }
});
(async () => {
    const nc = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name='customer_nudges' ORDER BY ordinal_position");
    const fs = require('fs');
    let out = 'NC:' + nc.rows.map(r => r.column_name).join('|') + '\n';

    const cbc = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name='customer_behavior' ORDER BY ordinal_position");
    out += 'CB:' + cbc.rows.map(r => r.column_name).join('|') + '\n';

    const atc = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name='authorization_transactions' ORDER BY ordinal_position");
    out += 'AT:' + atc.rows.map(r => r.column_name).join('|') + '\n';

    const mc = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name='merchants' ORDER BY ordinal_position");
    out += 'M:' + mc.rows.map(r => r.column_name).join('|') + '\n';

    const mrc = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name='merchant_recommendations' ORDER BY ordinal_position");
    out += 'MR:' + mrc.rows.map(r => r.column_name).join('|') + '\n';

    fs.writeFileSync('C:/tmp/db-cols.txt', out, 'utf8');
    console.log('Done -> C:/tmp/db-cols.txt');
    pool.end();
})();
