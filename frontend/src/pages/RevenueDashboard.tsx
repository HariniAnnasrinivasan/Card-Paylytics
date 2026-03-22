import React, { useEffect, useState } from 'react';
import Sidebar from '../components/manager/Sidebar';
import RevenueKpiCards from '../components/revenue/RevenueKpiCards';
import { 
    RevenueTrendChart, 
    IssuerAcquirerChart, 
    RevenueBreakdownChart, 
    CostAnalysisChart, 
    ProfitabilityChart 
} from '../components/revenue/RevenueCharts';
import RevenueAgentChat from '../components/revenue/RevenueAgentChat';
import api from '../api';

interface DashboardData {
    kpis: {
        total_mdr: number;
        total_issuer: number;
        total_acquirer: number;
        total_interchange: number;
    };
    charts: any[];
}

export default function RevenueDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRevenueData = async () => {
            try {
                const res = await api.get('/revenue/dashboard');
                setData(res.data);
            } catch (err: any) {
                console.error('Error fetching dashboard:', err);
                setError(err.response?.data?.error || 'Failed to load revenue data');
            } finally {
                setLoading(false);
            }
        };
        fetchRevenueData();
    }, []);

    return (
        <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #1e0546 0%, #2e1065 40%, #1e1b4b 100%)' }}>
            <Sidebar />
            
            <main className="flex-1 ml-64 p-8 overflow-auto">
                {/* Header Section */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-sm">Revenue Intelligence</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500 text-white uppercase tracking-wider">Premium</span>
                            <p className="text-purple-400/90 font-medium text-sm">Corporate performance & profitability engine</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-semibold text-purple-200 backdrop-blur-md">
                            MAR 2026 • REVENUE CYCLE
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-orange-500/20 rounded-full"></div>
                            <div className="absolute top-0 w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <div className="text-center">
                            <p className="text-white font-bold text-lg mb-1">Synthesizing Ledger Data</p>
                            <p className="text-purple-400 text-sm animate-pulse">Running profitability cross-check...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-3xl text-red-300 max-w-2xl mx-auto mt-20 text-center animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <h2 className="text-xl font-bold mb-2">Service Allocation Fault</h2>
                        <p className="text-sm text-red-400/80 mb-6">{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-100 px-6 py-2 rounded-xl text-sm font-bold transition-all border border-red-500/20"
                        >
                            Attempt System Recovery
                        </button>
                    </div>
                ) : data && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-1000">
                        {/* KPI Highlights */}
                        <RevenueKpiCards kpis={data.kpis} />

                        {/* Analytics Suite */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            <RevenueTrendChart data={data.charts} />
                            <IssuerAcquirerChart data={data.charts} />
                            <RevenueBreakdownChart data={data.charts} />
                            <CostAnalysisChart data={data.charts} />
                        </div>

                        {/* Dynamic Profitability Engine */}
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-[2rem] blur-2xl opacity-50"></div>
                            <ProfitabilityChart data={data.charts} />
                        </div>
                        
                        <div className="h-4"></div>
                    </div>
                )}
            </main>

            {/* AI Core Interaction Layer */}
            <RevenueAgentChat />
        </div>
    );
}
