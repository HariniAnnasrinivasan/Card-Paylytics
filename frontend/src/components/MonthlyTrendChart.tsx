import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api';

export default function MonthlyTrendChart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/customer/spending-summary').then(res => {
            setData(res.data);
            setLoading(false);
        }).catch(console.error);
    }, []);

    if (loading) return <div className="h-72 bg-white dark:bg-gray-800 rounded-2xl animate-pulse"></div>;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold mb-4">Monthly Spending Trend</h2>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.15} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            formatter={(value: any) => [`$${value}`, 'Total Spend']}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="total"
                            stroke="#ff6600"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#ff6600', strokeWidth: 2, stroke: '#6b21a8' }}
                            activeDot={{ r: 6, fill: '#ff6600', stroke: '#6b21a8' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
