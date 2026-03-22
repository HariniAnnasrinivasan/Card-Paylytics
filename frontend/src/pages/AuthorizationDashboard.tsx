import React, { useEffect, useState } from 'react';
import Sidebar from '../components/manager/Sidebar';
import api from '../api';
import AuthorizationChat from '../components/authorization/AuthorizationChat';
import { 
    AuthorizationKpis, 
    ApprovalDeclineChart, 
    DeclineReasonsChart, 
    ChannelUsageChart, 
    TransactionTrendChart, 
    HighValueChart, 
    IssuerPerformanceChart 
} from '../components/authorization/AuthorizationComponents';

export default function AuthorizationDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/authorization/dashboard');
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

            <main className="flex-1 ml-64 p-6 overflow-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white">Authorization Insights</h1>
                    <p className="text-purple-300 text-sm mt-1">Analyze transaction approvals, declines, and patterns</p>
                </div>

                {loading && (
                    <div className="flex items-center justify-center h-64">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-purple-300 text-sm">Loading authorization data…</p>
                        </div>
                    </div>
                )}

                {error && !loading && (
                    <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-500/30 text-red-300 text-sm">
                        ⚠️ {error}
                    </div>
                )}

                {!loading && data && (
                    <div className="space-y-6">
                        <AuthorizationKpis data={data.kpis} />

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <TransactionTrendChart data={data.charts.transactionTrend} />
                            <ApprovalDeclineChart data={data.charts.approvalDecline} />
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                            <DeclineReasonsChart data={data.charts.declineReasons} />
                            <ChannelUsageChart data={data.charts.channelUsage} />
                            <IssuerPerformanceChart data={data.charts.issuerPerformance} />
                        </div>

                        <HighValueChart data={data.charts.highValueTrend} />
                    </div>
                )}

                <AuthorizationChat />
            </main>
        </div>
    );
}
