import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../api';

export default function WeeklySpendChart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/customer/weekly-spend').then(res => {
            setData(res.data);
            setLoading(false);
        }).catch(console.error);
    }, []);

    if (loading) return <div className="h-72 bg-white dark:bg-gray-800 rounded-2xl animate-pulse"></div>;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold mb-4">Weekly Spend (December)</h2>
            <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.15} />
                        <XAxis dataKey="week" axisLine={false} tickLine={false} fontSize={12} />
                        <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} fontSize={12} />
                        <Tooltip
                            formatter={(value: any) => [`$${value}`, 'Spend']}
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="total" radius={[4, 4, 0, 0]} barSize={32}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#ff8c00' : '#ffb300'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
