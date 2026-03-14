import React, { useEffect, useState } from 'react';
import api from '../api';

interface Transaction {
    merchant: string;
    amount: string;
    date: string;
    category: string;
}

export default function LargestTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/customer/largest-transactions').then(res => {
            setTransactions(res.data);
            setLoading(false);
        }).catch(console.error);
    }, []);

    if (loading) return <div className="h-64 bg-white dark:bg-gray-800 rounded-2xl animate-pulse"></div>;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <h2 className="text-lg font-bold mb-4">Largest Transactions</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merchant Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {transactions.map((tx, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{tx.merchant}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(255, 140, 0, 0.15)', color: '#ff8c00' }}>
                                        {tx.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(tx.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 text-right">
                                    ${Number(tx.amount).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {transactions.length === 0 && (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">No transactions found for the current month.</div>
                )}
            </div>
        </div>
    );
}
