import { useEffect, useState } from 'react';
import Sidebar from '../components/manager/Sidebar';
import { 
    MerchantKpiCards, CategoryDistributionChart, 
    TicketSizeChart, RiskDistributionChart, 
    GeographicChart, RiskyMerchantsTable, PotentialPartnersTable
} from '../components/merchant/MerchantComponents';
import MerchantAgentChat from '../components/merchant/MerchantAgentChat';
import api from '../api';

export default function MerchantDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMerchantData = async () => {
            try {
                const res = await api.get('/merchant/dashboard');
                setData(res.data);
            } catch (err: any) {
                console.error('Error fetching merchant data:', err);
                setError(err.response?.data?.error || 'Failed to connect to merchant data core.');
            } finally {
                setLoading(false);
            }
        };
        fetchMerchantData();
    }, []);

    return (
        <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #1e0546 0%, #2e1065 40%, #1e1b4b 100%)' }}>
            <Sidebar />
            
            <main className="flex-1 ml-64 p-8 overflow-auto">
                {/* Header Section */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-sm">Merchant Insights</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500 text-white uppercase tracking-wider">Business Analytics</span>
                            <p className="text-purple-400/90 font-medium text-sm">Portfolio health & risk evaluation matrix</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex flex-col items-end backdrop-blur-md">
                            <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest">Risk Profiler</span>
                            <span className="text-xs font-black text-emerald-400 uppercase">ONLINE</span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-blue-500/20 rounded-full"></div>
                            <div className="absolute top-0 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <div className="text-center">
                            <p className="text-white font-bold text-lg mb-1">Loading Portfolio Data</p>
                            <p className="text-purple-400 text-sm animate-pulse">Computing risk matrices...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-3xl text-red-300 max-w-2xl mx-auto mt-20 text-center animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <h2 className="text-xl font-bold mb-2">Data Allocation Fault</h2>
                        <p className="text-sm text-red-400/80 mb-6">{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-100 px-6 py-2 rounded-xl text-sm font-bold transition-all border border-red-500/20"
                        >
                            Retry Connection
                        </button>
                    </div>
                ) : data && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-1000">
                        {/* KPI Highlights */}
                        <MerchantKpiCards kpis={data.kpis} />

                        {/* Top Row Analytics */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            <CategoryDistributionChart data={data.charts.categoryDistribution} />
                            <RiskDistributionChart data={data.charts.riskDistribution} />
                            <TicketSizeChart data={data.charts.ticketSizeByCategory} />
                            <GeographicChart data={data.charts.geographicSpread} />
                        </div>

                        {/* Critical Risky Table Layer */}
                        <div className="relative pb-10">
                            <div className="absolute -inset-1 bg-gradient-to-r from-red-500/10 to-transparent rounded-[2rem] blur-xl opacity-50 z-0"></div>
                            <div className="relative z-10">
                                <RiskyMerchantsTable data={data.charts.topHighRisk} />
                                {data.charts.potentialPartners && (
                                    <PotentialPartnersTable data={data.charts.potentialPartners} />
                                )}
                            </div>
                        </div>
                        
                        <div className="h-4"></div>
                    </div>
                )}
            </main>

            {/* AI Core Interaction Layer */}
            <MerchantAgentChat />
        </div>
    );
}
