import { ScatterChart, Scatter, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ZAxis } from 'recharts';
import { Target, Zap, ShieldAlert, ArrowUpRight, TrendingUp, Users, DollarSign, Activity, Sparkles, AlertTriangle } from 'lucide-react';

const fmt = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M`
    : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K`
    : n.toString();

const fmtMoney = (n: number) =>
    n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M`
    : n >= 1_000 ? `$${(n / 1_000).toFixed(1)}K`
    : `$${n.toFixed(2)}`;

export function AiSummaryBanner({ text }: { text: string }) {
    if (!text) return null;
    return (
        <div className="relative mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 shadow-lg p-6">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Sparkles size={120} />
            </div>
            <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-500/20 rounded-xl mt-1 ring-1 ring-indigo-500/40">
                    <Sparkles className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">AI Strategic Summary</h2>
                    <p className="text-lg text-indigo-100/90 leading-relaxed font-medium">{text}</p>
                </div>
            </div>
        </div>
    );
}

export function RecommendationKpis({ kpis }: { kpis: any }) {
    if (!kpis) return null;

    const cards = [
        {
            label: 'Total Platform Revenue',
            value: fmtMoney(kpis.totalRevenue || 0),
            icon: DollarSign,
            color: 'from-emerald-400 to-teal-500',
            bg: 'bg-emerald-500/10 border-emerald-500/20',
        },
        {
            label: 'Network Fraud Rate',
            value: `${kpis.fraudRate || 0}%`,
            icon: ShieldAlert,
            color: kpis.fraudRate > 2.0 ? 'from-red-500 to-rose-600' : 'from-indigo-400 to-blue-500',
            bg: 'bg-indigo-500/10 border-indigo-500/20',
        },
        {
            label: 'Global Approval Rate',
            value: `${kpis.approvalRate || 0}%`,
            icon: Activity,
            color: 'from-blue-400 to-cyan-500',
            bg: 'bg-blue-500/10 border-blue-500/20',
        },
        {
            label: 'Total Active Customers',
            value: fmt(kpis.totalCustomers || 0),
            icon: Users,
            color: 'from-purple-400 to-fuchsia-500',
            bg: 'bg-purple-500/10 border-purple-500/20',
        },
        {
            label: 'High-Risk Merchants',
            value: fmt(kpis.highRiskMerchants || 0),
            icon: AlertTriangle,
            color: 'from-orange-400 to-amber-500',
            bg: 'bg-orange-500/10 border-orange-500/20',
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {cards.map(({ label, value, icon: Icon, color, bg }) => (
                <div
                    key={label}
                    className={`rounded-2xl border p-5 flex flex-col gap-3 ${bg}`}
                    style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}
                >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                        <Icon size={20} className="text-white" />
                    </div>
                    <div>
                        <p className="text-xl lg:text-3xl font-bold text-white leading-none">{value}</p>
                        <p className="text-purple-300 text-xs mt-2 font-medium bg-black/20 w-fit px-2 py-0.5 rounded-full">{label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function StrategicActionCards({ strategies }: { strategies: any[] }) {
    if (!strategies) return null;
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Target className="text-indigo-400" /> Executive Actions
            </h3>
            {strategies.map((strategy, idx) => (
                <div key={idx} className="relative bg-gradient-to-r from-[#1a1c2e] to-[#0f0e2d] border border-indigo-500/30 p-6 rounded-2xl shadow-xl overflow-hidden hover:border-indigo-400/60 transition-colors">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-400 to-purple-500"></div>
                    <div className="flex gap-4 items-start">
                        <div className="mt-1">
                            <Zap className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-bold text-white mb-2">{strategy.title}</h4>
                            <p className="text-gray-400 text-sm mb-4 leading-relaxed">{strategy.description}</p>
                            
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 bg-black/20 rounded-lg p-3 border border-white/5">
                                    <p className="text-xs text-indigo-300 mb-1 font-semibold uppercase tracking-wider">Data Reason</p>
                                    <p className="text-sm text-gray-300 font-medium">{strategy.reason}</p>
                                </div>
                                <div className="flex-1 bg-indigo-500/10 rounded-lg p-3 border border-indigo-500/20">
                                    <p className="text-xs text-indigo-300 mb-1 font-semibold uppercase tracking-wider">Expected Impact</p>
                                    <p className="text-sm text-white font-bold flex items-center gap-1">
                                        <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                                        {strategy.impact}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function RiskRevenueScatter({ data }: { data: any[] }) {
    if (!data) return null;
    return (
        <div className="bg-[#1a1c2e] p-6 rounded-xl border border-gray-800 h-full flex flex-col" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
            <h3 className="text-lg font-semibold text-white mb-1">Risk vs Revenue Optimization</h3>
            <p className="text-xs text-gray-400 mb-6">Mapping average ticket sizes against local fraud counts.</p>
            <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis type="number" dataKey="risk" name="Fraud Count" stroke="#9ca3af" axisLine={false} tickLine={false} />
                        <YAxis type="number" dataKey="revenue" name="Avg Revenue" unit="$" stroke="#9ca3af" axisLine={false} tickLine={false} />
                        <ZAxis type="category" dataKey="name" name="Merchant" />
                        <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                        <Scatter name="Merchants" data={data} fill="#8b5cf6" shape="circle" />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function MiniTrendChart({ title, data, dataKey, color, isCurrency=false }: { title: string, data: any[], dataKey: string, color: string, isCurrency?: boolean }) {
    if (!data) return null;
    return (
        <div className="bg-[#1a1c2e] p-4 rounded-xl border border-gray-800" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-gray-300">{title}</h3>
                <TrendingUp size={16} className={`text-[${color}] opacity-80`} style={{ color }} />
            </div>
            <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '4px', fontSize: '12px' }}
                            formatter={(value: any) => isCurrency ? [`$${Number(value).toLocaleString()}`, title] : [value, title]}
                            labelStyle={{ display: 'none' }}
                        />
                        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function InsightList({ insights, title, icon: Icon, alertFormat=false }: { insights: any[], title: string, icon: any, alertFormat?: boolean }) {
    if (!insights) return null;
    return (
        <div className="bg-[#1a1c2e] p-6 rounded-xl border border-gray-800 h-full" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${alertFormat ? 'text-red-400' : 'text-emerald-400'}`}>
                <Icon size={20} /> {title}
            </h3>
            <div className="space-y-3">
                {insights.map((item, idx) => (
                    <div key={idx} className={`p-4 rounded-lg flex justify-between items-center border ${alertFormat ? 'bg-red-500/5 border-red-500/10' : 'bg-emerald-500/5 border-emerald-500/10'}`}>
                        <span className="text-white font-medium text-sm">{item.title}</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded bg-black/30 ${alertFormat ? 'text-red-300' : 'text-emerald-300'}`}>
                            {item.metric}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
