import React from 'react';
import { 
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, BarChart, Bar, Legend, AreaChart, Area
} from 'recharts';
import { ShieldAlert, Zap, MapPin, AlertTriangle } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 border border-purple-500/50 p-3 rounded-xl shadow-2xl backdrop-blur-md">
                <p className="text-purple-300 text-xs font-bold mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center justify-between gap-4 text-xs mb-1">
                        <span style={{ color: entry.color }}>{entry.name}:</span>
                        <span className="text-white font-mono">{entry.value.toLocaleString()} cases</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

// --- KPI CARDS ---
export function FraudKpiCards({ kpis }: { kpis: any }) {
    const cards = [
        { label: 'Total Fraud Events', value: kpis.totalFraud, icon: ShieldAlert, color: 'from-red-500 to-rose-600' },
        { label: 'Fraud Rate', value: `${kpis.fraudRate}%`, icon: Zap, color: 'from-orange-400 to-amber-500' },
        { label: 'High Risk Txns', value: kpis.highRisk, icon: AlertTriangle, color: 'from-purple-500 to-indigo-600' },
        { label: 'Loc Mismatch', value: kpis.locationMismatch, icon: MapPin, color: 'from-blue-500 to-cyan-500' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3 shadow-lg`}>
                        <card.icon size={20} className="text-white" />
                    </div>
                    <p className="text-2xl font-bold text-white leading-none">{card.value}</p>
                    <p className="text-purple-300 text-xs mt-1 font-medium">{card.label}</p>
                </div>
            ))}
        </div>
    );
}

// --- LINE CHART: FRAUD TREND ---
export function FraudTrendChart({ data }: { data: any[] }) {
    return (
        <div className="rounded-2xl border border-purple-700/30 p-5 bg-white/5 backdrop-blur-sm">
            <h3 className="text-white font-semibold mb-4 text-sm flex items-center gap-2">
                <div className="w-1.5 h-4 bg-orange-500 rounded-full"></div>
                Fraud Incident Trend
            </h3>
            <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="fraudColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.1)" vertical={false} />
                    <XAxis dataKey="date" tick={{fill: '#a78bfa', fontSize: 10}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill: '#a78bfa', fontSize: 10}} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="count" name="Fraud Cases" stroke="#f97316" fillOpacity={1} fill="url(#fraudColor)" strokeWidth={3} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

// --- PIE CHART: FRAUD DISTRIBUTION ---
const COLORS = ['#f97316', '#8b5cf6', '#3b82f6', '#f59e0b', '#ec4899', '#10b981'];

export function FraudTypeChart({ data }: { data: any[] }) {
    return (
        <div className="rounded-2xl border border-purple-700/30 p-5 bg-white/5 backdrop-blur-sm">
            <h3 className="text-white font-semibold mb-4 text-sm flex items-center gap-2">
                <div className="w-1.5 h-4 bg-orange-500 rounded-full"></div>
                Fraud Type Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={data.map(d => ({...d, value: parseInt(d.value, 10)}))}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: 10, fontSize: 11 }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

// --- BAR CHART: RISK SCORE ---
export function RiskScoreChart({ data }: { data: any[] }) {
    return (
        <div className="rounded-2xl border border-purple-700/30 p-5 bg-white/5 backdrop-blur-sm">
            <h3 className="text-white font-semibold mb-4 text-sm flex items-center gap-2">
                <div className="w-1.5 h-4 bg-purple-500 rounded-full"></div>
                Risk Score Segmentation
            </h3>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.1)" vertical={false} />
                    <XAxis dataKey="risk_level" tick={{fill: '#a78bfa', fontSize: 10}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill: '#a78bfa', fontSize: 10}} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(139,92,246,0.1)'}} />
                    <Bar dataKey="count" name="Transactions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

// --- BAR CHART: TIME OF DAY ---
export function TimeOfDayChart({ data }: { data: any[] }) {
    return (
        <div className="rounded-2xl border border-purple-700/30 p-5 bg-white/5 backdrop-blur-sm">
            <h3 className="text-white font-semibold mb-4 text-sm flex items-center gap-2">
                <div className="w-1.5 h-4 bg-teal-500 rounded-full"></div>
                Fraud by Time of Day (Hourly)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.1)" vertical={false} />
                    <XAxis dataKey="hour" tick={{fill: '#a78bfa', fontSize: 10}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill: '#a78bfa', fontSize: 10}} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(20,184,166,0.1)'}} />
                    <Bar dataKey="count" name="Incidents" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

// --- TABLE: TOP FRAUD MERCHANTS ---
export function TopFraudMerchantsTable({ data }: { data: any[] }) {
    return (
        <div className="rounded-2xl border border-purple-700/30 p-5 bg-white/5 backdrop-blur-sm">
            <h3 className="text-white font-semibold mb-4 text-sm flex items-center gap-2">
                <div className="w-1.5 h-4 bg-amber-500 rounded-full"></div>
                Riskiest Merchants
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-purple-100">
                    <thead className="border-b border-purple-700/30">
                        <tr>
                            <th className="pb-3 font-semibold text-purple-300">Merchant Name</th>
                            <th className="pb-3 font-semibold text-purple-300">Fraud Count</th>
                            <th className="pb-3 font-semibold text-purple-300">ID</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-700/10">
                        {data.map((m, i) => (
                            <tr key={i} className="group">
                                <td className="py-4 font-medium text-white">{m.merchant_name}</td>
                                <td className="py-4">
                                    <span className="bg-red-500/10 text-red-400 px-2 py-1 rounded-md font-bold text-xs">
                                        {m.fraud_count} cases
                                    </span>
                                </td>
                                <td className="py-4 text-purple-400 font-mono text-xs">{m.merchant_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
