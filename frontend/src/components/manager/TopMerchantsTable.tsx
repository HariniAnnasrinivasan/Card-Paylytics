import React from 'react';

interface Props {
    data: { category: string; avg_ticket_size: number; merchant_count: number }[];
}

export default function TopMerchantsTable({ data }: Props) {
    return (
        <div className="rounded-2xl border border-purple-700/30 p-5"
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
            <h3 className="text-white font-semibold mb-4 text-sm">Top Merchant Categories</h3>
            {data.length === 0 ? (
                <p className="text-purple-300 text-sm text-center py-8">No merchant data available</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-purple-800/50">
                                <th className="text-left py-2 px-3 text-purple-400 font-medium text-xs uppercase tracking-wider">Category</th>
                                <th className="text-right py-2 px-3 text-purple-400 font-medium text-xs uppercase tracking-wider">Avg Ticket</th>
                                <th className="text-right py-2 px-3 text-purple-400 font-medium text-xs uppercase tracking-wider">Merchants</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, i) => (
                                <tr key={i}
                                    className="border-b border-purple-900/30 hover:bg-purple-800/20 transition-colors">
                                    <td className="py-3 px-3 text-white font-medium">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0"></span>
                                            {row.category}
                                        </div>
                                    </td>
                                    <td className="py-3 px-3 text-right text-emerald-400 font-semibold">
                                        ${row.avg_ticket_size.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-3 px-3 text-right text-purple-300">
                                        {row.merchant_count.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
