import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
    data: { status: string; count: number }[];
}

const STATUS_COLORS: Record<string, string> = {
    approved: '#22c55e',
    Approved: '#22c55e',
    APPROVED: '#22c55e',
    declined: '#ef4444',
    Declined: '#ef4444',
    DECLINED: '#ef4444',
    pending: '#f59e0b',
    Pending: '#f59e0b',
    PENDING: '#f59e0b',
};

export default function ApprovalDeclineChart({ data }: Props) {
    return (
        <div className="rounded-2xl border border-purple-700/30 p-5"
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
            <h3 className="text-white font-semibold mb-4 text-sm">Approval vs Decline</h3>
            {data.length === 0 ? (
                <p className="text-purple-300 text-sm text-center py-12">No data available</p>
            ) : (
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.15)" vertical={false} />
                        <XAxis dataKey="status" tick={{ fill: '#a78bfa', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#a78bfa', fontSize: 11 }} axisLine={false} tickLine={false}
                            tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                        <Tooltip
                            contentStyle={{ background: '#1e1b4b', border: '1px solid #7c3aed', borderRadius: 12, color: '#fff' }}
                            formatter={(v: number) => [v.toLocaleString(), 'Count']}
                        />
                        <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={80}>
                            {data.map((entry, index) => (
                                <Cell key={index} fill={STATUS_COLORS[entry.status] || '#8b5cf6'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
