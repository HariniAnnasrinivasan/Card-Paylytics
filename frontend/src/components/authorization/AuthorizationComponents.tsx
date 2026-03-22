import React from 'react';
import { CreditCard, ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, LineChart, Line } from 'recharts';

export function AuthorizationKpis({ data }: { data: any }) {
    if (!data) return null;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-purple-700/30 p-5 flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-900/50 text-purple-300">
                    <CreditCard size={24} />
                </div>
                <div>
                    <p className="text-purple-300 text-sm">Total Transactions</p>
                    <p className="text-white text-2xl font-bold">{data.totalTransactions?.toLocaleString() || 0}</p>
                </div>
            </div>
            <div className="rounded-2xl border border-green-700/30 p-5 flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-900/50 text-green-300">
                    <ShieldCheck size={24} />
                </div>
                <div>
                    <p className="text-purple-300 text-sm">Approval Rate</p>
                    <p className="text-white text-2xl font-bold">{data.approvalRate || 0}%</p>
                </div>
            </div>
            <div className="rounded-2xl border border-red-700/30 p-5 flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-900/50 text-red-300">
                    <ShieldAlert size={24} />
                </div>
                <div>
                    <p className="text-purple-300 text-sm">Decline Rate</p>
                    <p className="text-white text-2xl font-bold">{data.declineRate || 0}%</p>
                </div>
            </div>
            <div className="rounded-2xl border border-orange-700/30 p-5 flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-900/50 text-orange-300">
                    <AlertTriangle size={24} />
                </div>
                <div>
                    <p className="text-purple-300 text-sm">High-Value Txns</p>
                    <p className="text-white text-2xl font-bold">{data.highValueTransactions || 0}</p>
                </div>
            </div>
        </div>
    );
}

export function ApprovalDeclineChart({ data }: { data: any[] }) {
    if (!data) return null;
    const colors = { Approved: '#22c55e', Declined: '#ef4444' };
    return (
        <div className="rounded-2xl border border-purple-700/30 p-5" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
            <h3 className="text-white font-semibold mb-4 text-sm">Approval vs Decline</h3>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.15)" vertical={false} />
                    <XAxis dataKey="auth_status" tick={{ fill: '#a78bfa', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#a78bfa', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#1e1b4b', border: '1px solid #7c3aed', borderRadius: 12, color: '#fff' }} />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={60}>
                        {data.map((entry, index) => (
                            <Cell key={index} fill={(colors as any)[entry.auth_status] || '#8b5cf6'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function DeclineReasonsChart({ data }: { data: any[] }) {
    if (!data) return null;
    return (
        <div className="rounded-2xl border border-purple-700/30 p-5" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
            <h3 className="text-white font-semibold mb-4 text-sm">Decline Reasons</h3>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.15)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#a78bfa', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="decline_reason_code" type="category" tick={{ fill: '#a78bfa', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#1e1b4b', border: '1px solid #7c3aed', borderRadius: 12, color: '#fff' }} />
                    <Bar dataKey="count" fill="#fb923c" radius={[0, 8, 8, 0]} maxBarSize={30} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function ChannelUsageChart({ data }: { data: any[] }) {
    if (!data) return null;
    const COLORS = ['#8b5cf6', '#3b82f6', '#ec4899', '#f59e0b'];
    return (
        <div className="rounded-2xl border border-purple-700/30 p-5" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
            <h3 className="text-white font-semibold mb-4 text-sm">Channel Usage</h3>
            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="count" nameKey="channel" label>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1e1b4b', border: '1px solid #7c3aed', borderRadius: 12, color: '#fff' }} />
                    <Legend wrapperStyle={{ fontSize: 12, color: '#a78bfa' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export function TransactionTrendChart({ data }: { data: any[] }) {
    if (!data) return null;
    return (
        <div className="rounded-2xl border border-purple-700/30 p-5" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
            <h3 className="text-white font-semibold mb-4 text-sm">Transaction Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.15)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: '#a78bfa', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#a78bfa', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#1e1b4b', border: '1px solid #7c3aed', borderRadius: 12, color: '#fff' }} />
                    <Line type="monotone" dataKey="count" stroke="#f97316" strokeWidth={3} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export function HighValueChart({ data }: { data: any[] }) {
    if (!data) return null;
    return (
        <div className="rounded-2xl border border-purple-700/30 p-5" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
            <h3 className="text-white font-semibold mb-4 text-sm">High Value Volume (Amount &gt; $1000)</h3>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.15)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: '#a78bfa', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#a78bfa', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                    <Tooltip contentStyle={{ background: '#1e1b4b', border: '1px solid #7c3aed', borderRadius: 12, color: '#fff' }} formatter={(v: any) => [`$${Number(v).toLocaleString()}`, 'Total Amount']} />
                    <Bar dataKey="total_amount" fill="#10b981" radius={[8, 8, 0, 0]} maxBarSize={40} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function IssuerPerformanceChart({ data }: { data: any[] }) {
    if (!data) return null;
    return (
        <div className="rounded-2xl border border-purple-700/30 p-5" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
            <h3 className="text-white font-semibold mb-4 text-sm">Issuer Performance</h3>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 10, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.15)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#a78bfa', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="issuer_bank" type="category" tick={{ fill: '#a78bfa', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#1e1b4b', border: '1px solid #7c3aed', borderRadius: 12, color: '#fff' }} />
                    <Bar dataKey="count" fill="#3b82f6" radius={[0, 8, 8, 0]} maxBarSize={30} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

