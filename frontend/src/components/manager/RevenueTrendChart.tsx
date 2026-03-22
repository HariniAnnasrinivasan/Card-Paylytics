import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Area, AreaChart
} from 'recharts';

interface Props {
    data: { month: string; revenue: number }[];
}

export default function RevenueTrendChart({ data }: Props) {
    return (
        <div className="rounded-2xl border border-purple-700/30 p-5"
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
            <h3 className="text-white font-semibold mb-4 text-sm">Revenue Trend (MDR)</h3>
            {data.length === 0 ? (
                <p className="text-purple-300 text-sm text-center py-12">No revenue data available</p>
            ) : (
                <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <defs>
                            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.15)" />
                        <XAxis dataKey="month" tick={{ fill: '#a78bfa', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#a78bfa', fontSize: 11 }} axisLine={false} tickLine={false}
                            tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                        <Tooltip
                            contentStyle={{ background: '#1e1b4b', border: '1px solid #7c3aed', borderRadius: 12, color: '#fff' }}
                            formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2.5}
                            fill="url(#revGrad)" dot={{ fill: '#f97316', r: 4 }} activeDot={{ r: 6 }} />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
