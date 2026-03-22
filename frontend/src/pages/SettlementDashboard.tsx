import React, { useEffect, useState } from 'react';
import Sidebar from '../components/manager/Sidebar';
import api from '../api';
import { 
    SettlementKpis, 
    SettlementTrendChart, 
    SettlementStatusChart, 
    FeeBreakdownChart, 
    InterchangeTrendChart, 
    SettlementDelayChart, 
    HighValueSettlementsTable 
} from '../components/settlement/SettlementComponents';
import SettlementChat from '../components/settlement/SettlementChat';
import { Loader2 } from 'lucide-react';

export default function SettlementDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/settlement/dashboard');
                setData(res.data);
            } catch (err) {
                console.error("Failed to load settlement data", err);
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
                    <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />
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
        <div className="flex bg-[#0f0e2d] min-h-screen text-white font-sans selection:bg-teal-500/30">
            <Sidebar />
            
            <div className="flex-1 p-8 ml-64 overflow-y-auto w-full">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            Settlement Insights
                        </h1>
                        <p className="text-gray-400 mt-2">Comprehensive view of settlement flows, fee breakdowns, and delays.</p>
                    </div>

                    {/* KPIs */}
                    <SettlementKpis kpis={data.kpis} />

                    {/* Top Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <SettlementTrendChart data={data.charts?.trend} />
                        </div>
                        <div className="lg:col-span-1">
                            <SettlementStatusChart data={data.charts?.status} />
                        </div>
                    </div>

                    {/* Middle Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <FeeBreakdownChart data={data.charts?.feeBreakdown} />
                        <InterchangeTrendChart data={data.charts?.interchange} />
                    </div>

                    {/* Bottom Charts & Tables */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                            <SettlementDelayChart data={data.charts?.delay} />
                        </div>
                        <div className="lg:col-span-2">
                            <HighValueSettlementsTable data={data.tables?.highValue} />
                        </div>
                    </div>
                </div>
            </div>
            
            <SettlementChat />
        </div>
    );
}
