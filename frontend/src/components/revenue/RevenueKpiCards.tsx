import React from 'react';
import { TrendingUp, Award, Landmark, ReceiptText } from 'lucide-react';

interface KpiData {
    total_mdr: string | number;
    total_issuer: string | number;
    total_acquirer: string | number;
    total_interchange: string | number;
}

interface Props {
    kpis: KpiData;
}

const fmtMoney = (val: string | number) => {
    const n = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(n)) return '$0.00';
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
    return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function RevenueKpiCards({ kpis }: Props) {
    const cards = [
        {
            label: 'Total MDR Revenue',
            value: fmtMoney(kpis.total_mdr),
            icon: TrendingUp,
            color: 'from-orange-400 to-amber-500',
            bg: 'bg-orange-500/10 border-orange-500/20',
        },
        {
            label: 'Issuer Revenue',
            value: fmtMoney(kpis.total_issuer),
            icon: Award,
            color: 'from-blue-500 to-cyan-500',
            bg: 'bg-blue-500/10 border-blue-500/20',
        },
        {
            label: 'Acquirer Revenue',
            value: fmtMoney(kpis.total_acquirer),
            icon: Landmark,
            color: 'from-violet-500 to-purple-600',
            bg: 'bg-violet-500/10 border-violet-500/20',
        },
        {
            label: 'Interchange Cost',
            value: fmtMoney(kpis.total_interchange),
            icon: ReceiptText,
            color: 'from-red-500 to-rose-600',
            bg: 'bg-red-500/10 border-red-500/20',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className={`rounded-2xl border p-5 flex flex-col gap-3 ${card.bg}`}
                    style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}
                >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                        <card.icon size={20} className="text-white" />
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-white leading-none">{card.value}</p>
                        <p className="text-purple-300 text-xs mt-1 font-medium">{card.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
