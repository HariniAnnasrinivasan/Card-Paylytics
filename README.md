# Card Paylytics (SaaS Financial Dashboard)

A comprehensive, AI-enhanced Payment Intelligence SaaS platform designed for Banks, Acquirers, and Merchants.

## Features
- **Manager (Executive) Dashboard**: Portfolio health, geographic risk spread, risky merchant monitoring, and cross-selling potential partner identification.
- **Customer Insights**: Deep demographic and behavioral profiling.
- **Revenue Insights**: MDR, Issuer, Acquirer, and Interchange fee flow visualizations.
- **Authorization & Fraud**: Real-time decline reason analytics and fraud risk rate telemetry.
- **Settlement Dashboard**: Real-time fund flow, fee deductions, and settlement delay tracking.
- **AI Recommendation Engine**: "What-If" strategic business modeling and macro-trend evaluations.
- **Targeted AI Chats**: Embedded AWS Bedrock Agents in every dashboard vertical to deliver on-the-fly intelligence.

## Architecture
- **Frontend**: React 19, Vite, Tailwind CSS 3.4, Recharts, Lucide Icons
- **Backend**: Node.js, Express, PostgreSQL, AWS SDK (Bedrock Runtime)
- **AI Service**: AWS Bedrock with 7 specialized Agents targeting discrete financial datasets.

## Getting Started
### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
1. Configure `.env` with DB and AWS Credentials:
   ```env
   PORT=5000
   DB_USER=postgres
   DB_PASSWORD=xxxx
   DB_HOST=xxxx
   DB_PORT=5432
   DB_NAME=postgres
   
   AWS_ACCESS_KEY_ID="XXXX"
   AWS_SECRET_ACCESS_KEY="XXXX"
   AWS_REGION="us-east-2"
   
   # Add your specific Agent IDs and Aliases
   CUSTOMER_AGENT_ID="XXXX"
   CUSTOMER_AGENT_ALIAS_ID="XXXX"
   # ... etc
   ```
2. Run backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

---
*Built with ❤️ for advanced payment analytics strategy.*
