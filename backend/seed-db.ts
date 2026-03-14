import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

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
        console.log('Creating saas_users table if it does not exist...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS saas_users (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(100),
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'customer',
                customer_id INT,
                tenant_id VARCHAR(50) DEFAULT 'BankA',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Table created or already exists.');

        const checkUser = await pool.query('SELECT * FROM saas_users WHERE email = $1', ['user@example.com']);
        if (checkUser.rows.length === 0) {
            console.log('Inserting test user...');
            const hashedPassword = await bcrypt.hash('password', 10);
            
            // Let's get a real customer_id from customer_behavior to link it
            const customerRes = await pool.query('SELECT customer_id FROM customer_behavior LIMIT 1');
            const customerId = customerRes.rows.length > 0 ? customerRes.rows[0].customer_id : null;
            
            await pool.query(`
                INSERT INTO saas_users (user_id, email, password, role, customer_id, tenant_id)
                VALUES ($1, $2, $3, $4, $5, $6)
            `, ['usr_test', 'user@example.com', hashedPassword, 'customer', customerId, 'BankA']);
            console.log('Test user created: user@example.com / password with customer_id', customerId);
        } else {
            console.log('Test user already exists.');
        }

    } catch (err) {
        console.error('Error seeding DB:', err);
    } finally {
        pool.end();
    }
}

run();
