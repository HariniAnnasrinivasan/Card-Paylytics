import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, Activity, CheckCircle, Clock } from 'lucide-react';

const COLORS = ['#8b5cf6', '#3b82f6', '#ec4899', '#f59e0b', '#10b981'];

const fmt = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M`
    : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K`
    : n.toString();

const fmtMoney = (n: number) =>
    n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M`
    : n >= 1_000 ? `$${(n / 1_000).toFixed(1)}K`
    : `$${n.toFixed(2)}`;

export function SettlementKpis({ kpis }: { kpis: any }) {
    if (!kpis) return null;

    const cards = [
        {
            label: 'Total Settled',
            value: fmtMoney(kpis.totalSettled || 0),
            icon: DollarSign,
            color: 'from-violet-500 to-purple-600',
            bg: 'bg-violet-500/10 border-violet-500/20',
        },
        {
            label: 'Successful',
            value: fmt(kpis.successful || 0),
            icon: CheckCircle,
            color: 'from-emerald-500 to-teal-500',
            bg: 'bg-emerald-500/10 border-emerald-500/20',
        },
        {
            label: 'Pending',
            value: fmt(kpis.pending || 0),
            icon: Clock,
            color: 'from-orange-400 to-amber-500',
            bg: 'bg-orange-500/10 border-orange-500/20',
        },
        {
            label: 'Total Fees',
            value: fmtMoney(kpis.totalFees || 0),
            icon: Activity,
            color: 'from-rose-500 to-red-600',
            bg: 'bg-rose-500/10 border-rose-500/20',
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                        <p className="text-3xl font-bold text-white leading-none">{value}</p>
                        <p className="text-purple-300 text-xs mt-1 font-medium">{label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function SettlementTrendChart({ data }: { data: any[] }) {
    if (!data) return null;
    return (
        <div className="bg-[#1a1c2e] p-6 rounded-xl border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Settlement Trend</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis dataKey="date" stroke="#9ca3af" axisLine={false} tickLine={false} />
                        <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                        <Line type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#8b5cf6' }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function SettlementStatusChart({ data }: { data: any[] }) {
    if (!data) return null;
    return (
        <div className="bg-[#1a1c2e] p-6 rounded-xl border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Status Distribution</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="count" nameKey="status" label>
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function FeeBreakdownChart({ data }: { data: any[] }) {
    if (!data) return null;
    return (
        <div className="bg-[#1a1c2e] p-6 rounded-xl border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Fee Breakdown</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis dataKey="date" stroke="#9ca3af" axisLine={false} tickLine={false} />
                        <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                        <Legend iconType="circle" />
                        <Bar dataKey="issuer_fee" stackId="a" fill="#8b5cf6" name="Issuer Fee" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="network_fee" stackId="a" fill="#f59e0b" name="Network Fee" />
                        <Bar dataKey="acquirer_fee" stackId="a" fill="#3b82f6" name="Acquirer Fee" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function InterchangeTrendChart({ data }: { data: any[] }) {
    if (!data) return null;
    return (
        <div className="bg-[#1a1c2e] p-6 rounded-xl border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Interchange Cost Trend</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis dataKey="date" stroke="#9ca3af" axisLine={false} tickLine={false} />
                        <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                        <Line type="monotone" dataKey="amount" stroke="#ec4899" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#ec4899' }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function SettlementDelayChart({ data }: { data: any[] }) {
    if (!data) return null;
    return (
        <div className="bg-[#1a1c2e] p-6 rounded-xl border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Delay Analysis</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={true} vertical={false} />
                        <XAxis type="number" stroke="#9ca3af" axisLine={false} tickLine={false} />
                        <YAxis dataKey="delay_bucket" type="category" stroke="#9ca3af" axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                        <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} name="Transactions" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function HighValueSettlementsTable({ data }: { data: any[] }) {
    if (!data || data.length === 0) return null;
    return (
        <div className="bg-[#1a1c2e] p-6 rounded-xl border border-gray-800 overflow-hidden">
            <h3 className="text-lg font-semibold text-white mb-4">High Value Settlements</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-gray-400 border-b border-gray-800">
                            <th className="pb-3 px-4 font-medium">Auth ID</th>
                            <th className="pb-3 px-4 font-medium">Date</th>
                            <th className="pb-3 px-4 font-medium">Amount</th>
                            <th className="pb-3 px-4 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-white text-sm">
                        {data.map((row, idx) => (
                            <tr key={idx} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                                <td className="py-3 px-4 font-mono text-gray-300">{row.auth_id}</td>
                                <td className="py-3 px-4">{row.date}</td>
                                <td className="py-3 px-4 font-semibold">${row.settlement_amount.toLocaleString()}</td>
                                <td className="py-3 px-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        row.settlement_status.toLowerCase() === 'success' ? 'bg-green-500/10 text-green-400' :
                                        row.settlement_status.toLowerCase() === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                                        'bg-red-500/10 text-red-400'
                                    }`}>
                                        {row.settlement_status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
