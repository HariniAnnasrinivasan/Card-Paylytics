import { useEffect, useState } from 'react';
import Sidebar from '../components/manager/Sidebar';
import { 
    FraudKpiCards, FraudTrendChart, FraudTypeChart, 
    RiskScoreChart, TimeOfDayChart, TopFraudMerchantsTable 
} from '../components/fraud/FraudComponents';
import FraudAgentChat from '../components/fraud/FraudAgentChat';
import api from '../api';

export default function FraudDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFraudData = async () => {
            try {
                const res = await api.get('/fraud/dashboard');
                setData(res.data);
            } catch (err: any) {
                console.error('Error fetching fraud data:', err);
                setError(err.response?.data?.error || 'Failed to connect to risk engine');
            } finally {
                setLoading(false);
            }
        };
        fetchFraudData();
    }, []);

    return (
        <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #1e0546 0%, #2e1065 40%, #1e1b4b 100%)' }}>
            <Sidebar />
            
            <main className="flex-1 ml-64 p-8 overflow-auto">
                {/* Header Section */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-sm">Fraud Intelligence</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500 text-white uppercase tracking-wider">Live Monitoring</span>
                            <p className="text-purple-400/90 font-medium text-sm">Security Command Center • Analytics Node 04</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex flex-col items-end backdrop-blur-md">
                            <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest">System Health</span>
                            <span className="text-xs font-black text-emerald-400 uppercase">99.9% SECURE</span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-[65vh] gap-8">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                            <div className="w-20 h-20 border-k border-red-500/10 rounded-full flex items-center justify-center relative bg-[#0c0a09]">
                                <div className="absolute inset-0 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                <ShieldAlert size={32} className="text-red-500 animate-pulse" />
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-white font-black text-xl mb-1 tracking-tight">Deciphering Threat Vectors</p>
                            <p className="text-red-400/60 font-medium text-sm animate-bounce">Scanning authorization logs...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="bg-red-950/20 border border-red-500/30 p-10 rounded-[2.5rem] text-red-100 max-w-2xl mx-auto mt-24 text-center backdrop-blur-2xl">
                        <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
                            <span className="text-4xl text-red-500">🚫</span>
                        </div>
                        <h2 className="text-2xl font-black mb-3 tracking-tight">Encryption Handshake Failed</h2>
                        <p className="text-red-400/80 font-medium mb-8 leading-relaxed px-10">{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="bg-red-600 hover:bg-red-700 text-white px-10 py-3.5 rounded-2xl text-sm font-black transition-all shadow-lg shadow-red-600/20 active:scale-95"
                        >
                            Reconnect Secured Stream
                        </button>
                    </div>
                ) : data && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        {/* Highlights Section */}
                        <FraudKpiCards kpis={data.kpis} />

                        {/* Primary Analytics Grid */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                            <FraudTrendChart data={data.charts.trend} />
                            <FraudTypeChart data={data.charts.distribution} />
                            <RiskScoreChart data={data.charts.riskSegmentation} />
                            <TimeOfDayChart data={data.charts.timeOfDay} />
                        </div>

                        {/* Secondary Analytics Layer */}
                        <div className="relative pb-10">
                            <div className="absolute -inset-4 bg-gradient-to-r from-red-500/5 to-orange-500/5 rounded-[3rem] blur-3xl -z-10"></div>
                            <TopFraudMerchantsTable data={data.charts.topMerchants} />
                        </div>
                    </div>
                )}
            </main>

            {/* AI Control Layer */}
            <FraudAgentChat />
        </div>
    );
}

import { ShieldAlert } from 'lucide-react';
