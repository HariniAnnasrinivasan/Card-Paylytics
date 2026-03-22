import React from 'react';
import { Users, Store, CreditCard, DollarSign, ShieldAlert } from 'lucide-react';

interface KpiData {
    totalCustomers: number;
    totalMerchants: number;
    totalTransactions: number;
    totalRevenue: number;
    totalFraud: number;
}

interface Props {
    kpis: KpiData;
}

const fmt = (n: number) =>
    n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M`
    : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K`
    : n.toString();

const fmtMoney = (n: number) =>
    n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M`
    : n >= 1_000 ? `$${(n / 1_000).toFixed(1)}K`
    : `$${n.toFixed(2)}`;

const cards = (kpis: KpiData) => [
    {
        label: 'Total Customers',
        value: fmt(kpis.totalCustomers),
        icon: Users,
        color: 'from-violet-500 to-purple-600',
        bg: 'bg-violet-500/10 border-violet-500/20',
    },
    {
        label: 'Total Merchants',
        value: fmt(kpis.totalMerchants),
        icon: Store,
        color: 'from-blue-500 to-cyan-500',
        bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
        label: 'Total Transactions',
        value: fmt(kpis.totalTransactions),
        icon: CreditCard,
        color: 'from-orange-400 to-amber-500',
        bg: 'bg-orange-500/10 border-orange-500/20',
    },
    {
        label: 'Total MDR Revenue',
        value: fmtMoney(kpis.totalRevenue),
        icon: DollarSign,
        color: 'from-emerald-500 to-teal-500',
        bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
        label: 'Total Fraud Cases',
        value: fmt(kpis.totalFraud),
        icon: ShieldAlert,
        color: 'from-red-500 to-rose-600',
        bg: 'bg-red-500/10 border-red-500/20',
    },
];

export default function KpiCards({ kpis }: Props) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {cards(kpis).map(({ label, value, icon: Icon, color, bg }) => (
                <div
                    key={label}
                    className={`rounded-2xl border p-5 flex flex-col gap-3 ${bg}`}
                    style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}
                >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                        <Icon size={20} className="text-white" />
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-white leading-none">{value}</p>
                        <p className="text-purple-300 text-xs mt-1 font-medium">{label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
