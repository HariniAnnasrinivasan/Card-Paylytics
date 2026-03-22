import { useEffect, useState } from 'react';
import Sidebar from '../components/manager/Sidebar';
import api from '../api';
import { 
    AiSummaryBanner, 
    RecommendationKpis, 
    StrategicActionCards, 
    RiskRevenueScatter,
    MiniTrendChart,
    InsightList
} from '../components/recommendations/RecommendationComponents';
import RecommendationChat from '../components/recommendations/RecommendationChat';
import { Loader2, Zap, ShieldAlert } from 'lucide-react';

export default function RecommendationDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/recommendation/dashboard');
                setData(res.data);
            } catch (err) {
                console.error("Failed to load recommendation data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex bg-[#0f0e2d] h-screen text-white">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex bg-[#0f0e2d] h-screen text-white">
                <Sidebar />
                <div className="flex-1 p-8">Error loading strategy engine.</div>
            </div>
        );
    }

    return (
        <div className="flex bg-[#0f0e2d] min-h-screen text-white font-sans selection:bg-indigo-500/30">
            <Sidebar />
            
            <div className="flex-1 p-8 ml-64 overflow-y-auto w-full">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            Strategy & Recommendations
                        </h1>
                        <p className="text-gray-400 mt-2">Executive AI Decision Engine consolidating revenue, fraud, and customer insights.</p>
                    </div>

                    {/* AI Executive Summary Banner */}
                    <AiSummaryBanner text={data.summary} />

                    {/* Core KPIs */}
                    <RecommendationKpis kpis={data.kpis} />

                    {/* Middle Tier: Strategy Cards and Risk Tradeoff */}
                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                        <div className="xl:col-span-3">
                            <StrategicActionCards strategies={data.strategies} />
                        </div>
                        <div className="xl:col-span-2 space-y-6">
                            {/* Scatter Plot */}
                            <RiskRevenueScatter data={data.scatter} />
                        </div>
                    </div>

                    {/* Lower Tier: Opportunity, Risk, and Trends */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                            <InsightList insights={data.opportunities} title="Growth Opportunities" icon={Zap} />
                        </div>
                        <div className="lg:col-span-1">
                            <InsightList insights={data.risks} title="High-Risk Warnings" icon={ShieldAlert} alertFormat={true} />
                        </div>
                        <div className="lg:col-span-1 flex flex-col gap-4">
                            <MiniTrendChart title="Revenue Trajectory" data={data.trends?.revenue} dataKey="value" color="#10b981" isCurrency={true} />
                            <MiniTrendChart title="Fraud Deflections" data={data.trends?.fraud} dataKey="value" color="#ef4444" />
                            <MiniTrendChart title="Approval Volume" data={data.trends?.approval} dataKey="value" color="#3b82f6" />
                        </div>
                    </div>

                </div>
            </div>
            
            <RecommendationChat />
        </div>
    );
}
