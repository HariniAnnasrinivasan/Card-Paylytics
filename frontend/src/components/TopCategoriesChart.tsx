import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../api';

export default function TopCategoriesChart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/customer/top-categories').then(res => {
            setData(res.data);
            setLoading(false);
        }).catch(console.error);
    }, []);

    if (loading) return <div className="h-64 bg-white dark:bg-gray-800 rounded-2xl animate-pulse"></div>;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold mb-4">Top Spending Categories</h2>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#374151" opacity={0.15} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} fontSize={12} width={100} />
                        <Tooltip
                            formatter={(value: any) => [`$${value}`, 'Spend']}
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                            {data.map((entry, index) => {
                                const barColors = ['#ff6600', '#ff8c00', '#ffa726', '#ffb300', '#ffca28'];
                                return <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                            })}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
