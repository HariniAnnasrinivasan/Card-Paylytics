import { useEffect, useState } from 'react';
import Sidebar from '../components/manager/Sidebar';
import api from '../api';
import { 
    CustomerInsightsKpis, 
    BarChartCard, 
    PieChartCard, 
    HighValueCustomers 
} from '../components/customer-insights/CustomerInsightsComponents';
import CustomerInsightsChat from '../components/customer-insights/CustomerInsightsChat';
import { Loader2 } from 'lucide-react';

export default function CustomerInsightsDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/customer-insights/dashboard');
                setData(res.data);
            } catch (err) {
                console.error("Failed to load customer insights data", err);
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
                    <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex bg-[#0f0e2d] h-screen text-white">
                <Sidebar />
                <div className="flex-1 p-8">Error loading dashboard.</div>
            </div>
        );
    }

    return (
        <div className="flex bg-[#0f0e2d] min-h-screen text-white font-sans selection:bg-purple-500/30">
            <Sidebar />
            
            <div className="flex-1 p-8 ml-64 overflow-y-auto w-full">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            Customer Base Insights (Manager View)
                        </h1>
                        <p className="text-gray-400 mt-2">Macro-level behavioral analysis, demographics, and spending geographies.</p>
                    </div>

                    {/* KPIs */}
                    <CustomerInsightsKpis kpis={data.kpis} />

                    {/* Demographics & Segmentation */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                            <PieChartCard title="Gender Distribution" data={data.charts?.genderDistribution} dataKey="count" nameKey="gender" />
                        </div>
                        <div className="lg:col-span-2">
                            <BarChartCard title="Segment Distribution" data={data.charts?.segmentDistribution} dataKey="count" nameKey="segment" color="#f59e0b" />
                        </div>
                    </div>

                    {/* Geography */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <BarChartCard title="Top Cities" data={data.charts?.cityDistribution} dataKey="count" nameKey="city" color="#3b82f6" />
                        <BarChartCard title="Top States" data={data.charts?.stateDistribution} dataKey="count" nameKey="state" color="#ec4899" />
                    </div>

                    {/* Behavior and Economics */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <BarChartCard title="Top Spending Categories" data={data.charts?.topCategories} dataKey="count" nameKey="top_category" color="#10b981" />
                        </div>
                        <div className="lg:col-span-1">
                            <PieChartCard title="Spending Patterns" data={data.charts?.spendingPattern} dataKey="count" nameKey="spending_pattern" />
                        </div>
                    </div>

                    {/* Bottom row: Age and High Value Table */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                            <BarChartCard title="Age Distribution" data={data.charts?.ageDistribution} dataKey="count" nameKey="age" color="#6366f1" />
                        </div>
                        <div className="lg:col-span-2">
                            <HighValueCustomers data={data.tables?.highValueCustomers} />
                        </div>
                    </div>
                </div>
            </div>
            
            <CustomerInsightsChat />
        </div>
    );
}
