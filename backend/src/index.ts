import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import customerRoutes from './routes/customer';
import managerRoutes from './routes/manager';
import revenueRoutes from './routes/revenue';
import fraudRoutes from './routes/fraud';
import merchantRoutes from './routes/merchant';
import authorizationRoutes from './routes/authorization';
import settlementRoutes from './routes/settlement';
import customerInsightsRoutes from './routes/customer-insights';
import recommendationRoutes from './routes/recommendation';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Apply routes
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/revenue', revenueRoutes);
app.use('/api/fraud', fraudRoutes);
app.use('/api/merchant', merchantRoutes);
app.use('/api/authorization', authorizationRoutes);
app.use('/api/settlement', settlementRoutes);
app.use('/api/customer-insights', customerInsightsRoutes);
app.use('/api/recommendation', recommendationRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Backend server listening on port ${PORT}`);
});
