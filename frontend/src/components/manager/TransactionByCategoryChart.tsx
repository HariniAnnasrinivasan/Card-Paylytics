import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

interface Props {
    data: { category: string; count: number }[];
}

const COLORS = ['#f97316', '#fb923c', '#fdba74', '#c2410c', '#ea580c', '#d97706', '#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'];

export default function TransactionByCategoryChart({ data }: Props) {
    return (
        <div className="rounded-2xl border border-purple-700/30 p-5"
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
            <h3 className="text-white font-semibold mb-4 text-sm">Transactions by Category</h3>
            {data.length === 0 ? (
                <p className="text-purple-300 text-sm text-center py-12">No data available</p>
            ) : (
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 15, left: 80, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.15)" horizontal={false} />
                        <XAxis type="number" tick={{ fill: '#a78bfa', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="category" tick={{ fill: '#d8b4fe', fontSize: 11 }}
                            axisLine={false} tickLine={false} width={80} />
                        <Tooltip
                            contentStyle={{ background: '#1e1b4b', border: '1px solid #7c3aed', borderRadius: 12, color: '#fff' }}
                            formatter={(v: number) => [v.toLocaleString(), 'Transactions']}
                        />
                        <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                            {data.map((_, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
