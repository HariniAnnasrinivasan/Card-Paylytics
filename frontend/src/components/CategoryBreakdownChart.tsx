import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api';

const COLORS = ['#ff6600', '#ff8c00', '#ffa726', '#ffb300', '#ffca28', '#ffe082', '#fff8e1'];

export default function CategoryBreakdownChart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/customer/category-breakdown').then(res => {
            setData(res.data);
            setLoading(false);
        }).catch(console.error);
    }, []);

    if (loading) return <div className="h-72 bg-white dark:bg-gray-800 rounded-2xl animate-pulse"></div>;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold mb-4">Category Breakdown</h2>
            <div className="h-56 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                        <Pie
                            data={data}
                            innerRadius={55}
                            outerRadius={75}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: any) => [`$${value}`, 'Spend']}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
