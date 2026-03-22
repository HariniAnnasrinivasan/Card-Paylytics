import React from 'react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Area, AreaChart, Legend, ComposedChart
} from 'recharts';

interface ChartData {
    date: string;
    total_mdr_revenue: number;
    issuer_revenue: number;
    acquirer_revenue: number;
    interchange_cost: number;
    network_fee_paid: number;
    fuel_surcharge_recovery: number;
    crossborder_revenue: number;
    profit: number;
}

interface Props {
    data: ChartData[];
}

const formatCurrency = (value: number) => `$${(value / 1000).toFixed(0)}K`;

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 border border-purple-500/50 p-3 rounded-xl shadow-2xl backdrop-blur-md">
                <p className="text-purple-300 text-xs font-bold mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center justify-between gap-4 text-xs mb-1">
                        <span style={{ color: entry.color }}>{entry.name}:</span>
                        <span className="text-white font-mono">${entry.value.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export function RevenueTrendChart({ data }: Props) {
    return (
        <div className="rounded-2xl border border-purple-700/30 p-5 bg-white/5 backdrop-blur-sm">
            <h3 className="text-white font-semibold mb-4 text-sm">Revenue Trend (Total MDR)</h3>
            <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorMdr" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.1)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: '#a78bfa', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#a78bfa', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="total_mdr_revenue" name="Total MDR" stroke="#f97316" strokeWidth={3} fill="url(#colorMdr)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export function IssuerAcquirerChart({ data }: Props) {
    return (
        <div className="rounded-2xl border border-purple-700/30 p-5 bg-white/5 backdrop-blur-sm">
            <h3 className="text-white font-semibold mb-4 text-sm">Issuer vs Acquirer Revenue</h3>
            <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.1)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: '#a78bfa', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#a78bfa', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: 10, fontSize: 11 }} />
                    <Bar dataKey="issuer_revenue" name="Issuer" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="acquirer_revenue" name="Acquirer" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function RevenueBreakdownChart({ data }: Props) {
    return (
        <div className="rounded-2xl border border-purple-700/30 p-5 bg-white/5 backdrop-blur-sm">
            <h3 className="text-white font-semibold mb-4 text-sm">Revenue Component Breakdown</h3>
            <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.1)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: '#a78bfa', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#a78bfa', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: 10, fontSize: 11 }} />
                    <Bar dataKey="issuer_revenue" name="Issuer" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="acquirer_revenue" name="Acquirer" stackId="a" fill="#8b5cf6" />
                    <Bar dataKey="fuel_surcharge_recovery" name="Fuel Surcharge" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="crossborder_revenue" name="Cross-Border" stackId="a" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function CostAnalysisChart({ data }: Props) {
    return (
        <div className="rounded-2xl border border-purple-700/30 p-5 bg-white/5 backdrop-blur-sm">
            <h3 className="text-white font-semibold mb-4 text-sm">Cost Analysis (Interchange & Network)</h3>
            <ResponsiveContainer width="100%" height={240}>
                <ComposedChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.1)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: '#a78bfa', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#a78bfa', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: 10, fontSize: 11 }} />
                    <Bar dataKey="interchange_cost" name="Interchange Cost" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Line type="monotone" dataKey="network_fee_paid" name="Network Fee" stroke="#fcd34d" strokeWidth={2} dot={{ r: 3 }} />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}

export function ProfitabilityChart({ data }: Props) {
    return (
        <div className="rounded-2xl border border-purple-700/30 p-5 bg-white/5 backdrop-blur-sm">
            <h3 className="text-white font-semibold mb-4 text-sm">Net Profitability Trend</h3>
            <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.1)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: '#a78bfa', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#a78bfa', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="profit" name="Net Profit" stroke="#10b981" strokeWidth={3} fill="url(#colorProfit)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
