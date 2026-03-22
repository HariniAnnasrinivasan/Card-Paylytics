import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Props {
    data: { segment: string; count: number }[];
}

const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#7c3aed', '#6d28d9', '#5b21b6'];

export default function CustomerSegmentChart({ data }: Props) {
    return (
        <div className="rounded-2xl border border-purple-700/30 p-5"
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
            <h3 className="text-white font-semibold mb-4 text-sm">Customer Segments</h3>
            {data.length === 0 ? (
                <p className="text-purple-300 text-sm text-center py-12">No segment data available</p>
            ) : (
                <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="45%"
                            innerRadius={55}
                            outerRadius={85}
                            paddingAngle={3}
                            dataKey="count"
                            nameKey="segment"
                        >
                            {data.map((_, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ background: '#1e1b4b', border: '1px solid #7c3aed', borderRadius: 12, color: '#fff' }}
                            formatter={(v: number, name: string) => [v.toLocaleString(), name]}
                        />
                        <Legend
                            iconType="circle"
                            iconSize={8}
                            formatter={(value) => <span style={{ color: '#d8b4fe', fontSize: 11 }}>{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
