import React, { useEffect, useState } from 'react';
import Sidebar from '../components/manager/Sidebar';
import KpiCards from '../components/manager/KpiCards';
import RevenueTrendChart from '../components/manager/RevenueTrendChart';
import TransactionByCategoryChart from '../components/manager/TransactionByCategoryChart';
import FraudOverviewChart from '../components/manager/FraudOverviewChart';
import CustomerSegmentChart from '../components/manager/CustomerSegmentChart';
import ApprovalDeclineChart from '../components/manager/ApprovalDeclineChart';
import TopMerchantsTable from '../components/manager/TopMerchantsTable';
import api from '../api';

interface DashboardData {
    kpis: {
        totalCustomers: number;
        totalMerchants: number;
        totalTransactions: number;
        totalRevenue: number;
        totalFraud: number;
    };
    revenueTrend: { month: string; revenue: number }[];
    txnByCategory: { category: string; count: number }[];
    fraudOverview: { fraud_type: string; count: number }[];
    customerSegments: { segment: string; count: number }[];
    approvalDecline: { status: string; count: number }[];
    topMerchants: { category: string; avg_ticket_size: number; merchant_count: number }[];
}

const defaultData: DashboardData = {
    kpis: { totalCustomers: 0, totalMerchants: 0, totalTransactions: 0, totalRevenue: 0, totalFraud: 0 },
    revenueTrend: [],
    txnByCategory: [],
    fraudOverview: [],
    customerSegments: [],
    approvalDecline: [],
    topMerchants: [],
};

export default function ManagerDashboard() {
    const [data, setData] = useState<DashboardData>(defaultData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/manager/dashboard');
                setData(res.data);
            } catch (err: any) {
                setError(err.response?.data?.error || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen flex"
            style={{ background: 'linear-gradient(135deg, #1e0546 0%, #2e1065 40%, #1e1b4b 100%)' }}>
            <Sidebar />

            {/* Main content — offset by sidebar width */}
            <main className="flex-1 ml-64 p-6 overflow-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white">Bank Manager Overview</h1>
                    <p className="text-purple-300 text-sm mt-1">Real-time payment intelligence &amp; analytics</p>
                </div>

                {loading && (
                    <div className="flex items-center justify-center h-64">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-purple-300 text-sm">Loading dashboard data…</p>
                        </div>
                    </div>
                )}

                {error && !loading && (
                    <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-500/30 text-red-300 text-sm">
                        ⚠️ {error}
                    </div>
                )}

                {!loading && (
                    <div className="space-y-6">
                        {/* KPI Cards */}
                        <KpiCards kpis={data.kpis} />

                        {/* Revenue Trend — full width */}
                        <RevenueTrendChart data={data.revenueTrend} />

                        {/* Row 2: Transaction by Category + Approval vs Decline */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <TransactionByCategoryChart data={data.txnByCategory} />
                            <ApprovalDeclineChart data={data.approvalDecline} />
                        </div>

                        {/* Row 3: Fraud Overview + Customer Segments */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <FraudOverviewChart data={data.fraudOverview} />
                            <CustomerSegmentChart data={data.customerSegments} />
                        </div>

                        {/* Top Merchants Table — full width */}
                        <TopMerchantsTable data={data.topMerchants} />
                    </div>
                )}
            </main>
        </div>
    );
}
