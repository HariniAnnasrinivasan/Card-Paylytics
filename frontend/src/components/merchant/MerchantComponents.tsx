import React from 'react';
import { 
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { Store, AlertTriangle, BadgeDollarSign, MapPin } from 'lucide-react';

const formatCurrency = (value: number) => `$${value.toFixed(0)}`;

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 border border-purple-500/50 p-3 rounded-xl shadow-2xl backdrop-blur-md">
                <p className="text-purple-300 text-xs font-bold mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center justify-between gap-4 text-xs mb-1">
                        <span style={{ color: entry.color }}>{entry.name}:</span>
                        <span className="text-white font-mono">
                            {entry.name.includes('Size') 
                                ? `$${entry.value.toLocaleString()}` 
                                : entry.value.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

// --- KPI CARDS ---
export function MerchantKpiCards({ kpis }: { kpis: any }) {
    const cards = [
        { label: 'Total Merchants', value: kpis.totalMerchants, icon: Store, border: 'border-blue-500/50', bg: 'bg-blue-500/10', iconColor: 'text-blue-400' },
        { label: 'Avg Ticket Size', value: formatCurrency(kpis.avgTicketSize), icon: BadgeDollarSign, border: 'border-emerald-500/50', bg: 'bg-emerald-500/10', iconColor: 'text-emerald-400' },
        { label: 'High-Risk Merchants', value: kpis.highRisk, icon: AlertTriangle, border: 'border-red-500/50', bg: 'bg-red-500/10', iconColor: 'text-red-400' },
        { label: 'Medium-Risk Merchants', value: kpis.mediumRisk, icon: AlertTriangle, border: 'border-amber-500/50', bg: 'bg-amber-500/10', iconColor: 'text-amber-400' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, i) => (
                <div key={i} className={`bg-white/5 border ${card.border} rounded-2xl p-6 backdrop-blur-md flex items-center gap-5 shadow-lg`}>
                    <div className={`w-14 h-14 rounded-full ${card.bg} flex items-center justify-center shrink-0`}>
                        <card.icon size={26} className={card.iconColor} />
                    </div>
                    <div>
                        <p className="text-3xl font-black text-white leading-tight">{card.value}</p>
                        <p className="text-purple-300 text-sm font-semibold">{card.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

// --- CATEGORY DISTRIBUTION CHART ---
export function CategoryDistributionChart({ data }: { data: any[] }) {
    return (
        <div className="rounded-2xl border border-purple-700/30 p-6 bg-white/5 backdrop-blur-sm shadow-xl">
            <h3 className="text-white font-semibold mb-6 text-sm flex items-center gap-2">
                <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                Merchant Category Distribution
            </h3>
            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.1)" vertical={false} />
                    <XAxis dataKey="category" tick={{fill: '#a78bfa', fontSize: 10}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill: '#a78bfa', fontSize: 10}} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(139,92,246,0.1)'}} />
                    <Bar dataKey="count" name="Merchants" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

// --- TICKET SIZE BY CATEGORY CHART ---
export function TicketSizeChart({ data }: { data: any[] }) {
    return (
        <div className="rounded-2xl border border-purple-700/30 p-6 bg-white/5 backdrop-blur-sm shadow-xl">
            <h3 className="text-white font-semibold mb-6 text-sm flex items-center gap-2">
                <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                Avg Ticket Size by Category
            </h3>
            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.1)" vertical={false} />
                    <XAxis dataKey="category" tick={{fill: '#a78bfa', fontSize: 10}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill: '#a78bfa', fontSize: 10}} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(139,92,246,0.1)'}} />
                    <Bar dataKey="avg_ticket" name="Ticket Size" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

// --- RISK DISTRIBUTION PIE CHART ---
const RISK_COLORS: Record<string, string> = {
    'low': '#10b981',
    'medium': '#f59e0b',
    'high': '#ef4444',
    'Low': '#10b981',
    'Medium': '#f59e0b',
    'High': '#ef4444'
};
export function RiskDistributionChart({ data }: { data: any[] }) {
    return (
        <div className="rounded-2xl border border-purple-700/30 p-6 bg-white/5 backdrop-blur-sm shadow-xl">
            <h3 className="text-white font-semibold mb-6 text-sm flex items-center gap-2">
                <div className="w-1.5 h-4 bg-orange-500 rounded-full"></div>
                Overall Risk Split
            </h3>
            <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="risk_level"
                    >
                        {data.map((entry, index) => {
                            const normalizedRisk = (entry.risk_level || '').toLowerCase();
                            const color = RISK_COLORS[normalizedRisk] || (normalizedRisk === 'high' ? '#ef4444' : normalizedRisk === 'medium' ? '#f59e0b' : normalizedRisk === 'low' ? '#10b981' : '#8b5cf6');
                            return <Cell key={`cell-${index}`} fill={color} />;
                        })}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: 10, fontSize: 12 }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

// --- GEOGRAPHIC SPREAD CHART ---
export function GeographicChart({ data }: { data: any[] }) {
    return (
        <div className="rounded-2xl border border-purple-700/30 p-6 bg-white/5 backdrop-blur-sm shadow-xl">
            <h3 className="text-white font-semibold mb-6 text-sm flex items-center gap-2">
                <div className="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
                Top States by Merchant Volume
            </h3>
            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.1)" vertical={false} />
                    <XAxis dataKey="state" tick={{fill: '#a78bfa', fontSize: 10}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill: '#a78bfa', fontSize: 10}} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(139,92,246,0.1)'}} />
                    <Bar dataKey="count" name="Merchants" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

// --- RISKY MERCHANTS TABLE ---
export function RiskyMerchantsTable({ data }: { data: any[] }) {
    return (
        <div className="rounded-2xl border border-purple-700/30 p-6 bg-[#0f0e2d]/50 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-rose-500 rounded-full"></div>
                    High-Risk Merchant Watchlist
                </h3>
                <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-lg uppercase tracking-wider">
                    Critical Monitoring
                </span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-purple-100">
                    <thead className="border-b border-purple-500/30">
                        <tr>
                            <th className="pb-3 px-4 font-semibold text-purple-300">Merchant Name</th>
                            <th className="pb-3 px-4 font-semibold text-purple-300">Category</th>
                            <th className="pb-3 px-4 font-semibold text-purple-300 text-right">Avg Ticket Size</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-500/10">
                        {data.map((m, i) => (
                            <tr key={i} className="group hover:bg-white/5 transition-colors">
                                <td className="py-4 px-4 font-bold text-white">{m.merchant_name}</td>
                                <td className="py-4 px-4 text-purple-300">{m.merchant_category}</td>
                                <td className="py-4 px-4 text-right">
                                    <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1.5 rounded-md font-mono font-black text-xs">
                                        ${Number(m.avg_ticket_size).toFixed(2)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {data.length === 0 && (
                <div className="py-8 text-center text-purple-400/50 italic text-sm">
                    No high-risk merchants detected at this time.
                </div>
            )}
        </div>
    );
}

// --- POTENTIAL PARTNERS TABLE ---
export function PotentialPartnersTable({ data }: { data: any[] }) {
    if (!data) return null;
    return (
        <div className="rounded-2xl border border-emerald-700/30 p-6 bg-[#0f2d1e]/50 backdrop-blur-sm shadow-xl mt-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                    Potential Partnership Opportunities
                </h3>
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg uppercase tracking-wider">
                    High Revenue Impact
                </span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-emerald-100">
                    <thead className="border-b border-emerald-500/30">
                        <tr>
                            <th className="pb-3 px-4 font-semibold text-emerald-300">Merchant Name</th>
                            <th className="pb-3 px-4 font-semibold text-emerald-300">Category</th>
                            <th className="pb-3 px-4 font-semibold text-emerald-300 text-right">Avg Ticket Size</th>
                            <th className="pb-3 px-4 font-semibold text-emerald-300 text-right">Potential Discount</th>
                            <th className="pb-3 px-4 font-semibold text-emerald-300 text-right">Est. Revenue Impact</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-500/10">
                        {data.map((m, i) => (
                            <tr key={i} className="group hover:bg-white/5 transition-colors">
                                <td className="py-4 px-4 font-bold text-white">{m.merchant_name}</td>
                                <td className="py-4 px-4 text-emerald-300">{m.merchant_category}</td>
                                <td className="py-4 px-4 text-right">
                                    <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1.5 rounded-md font-mono font-black text-xs">
                                        ${Number(m.avg_ticket_size).toFixed(2)}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <span className="bg-blue-500/10 text-blue-400 px-2 py-1.5 rounded-md font-mono font-black text-xs">
                                        ${Number(m.potential_discount).toFixed(2)}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <span className="bg-amber-500/10 text-amber-400 px-2 py-1.5 rounded-md font-mono font-black text-xs">
                                        ${Number(m.estimated_revenue_impact).toFixed(2)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {data.length === 0 && (
                <div className="py-8 text-center text-emerald-400/50 italic text-sm">
                    No partnership opportunities detected at this time.
                </div>
            )}
        </div>
    );
}
