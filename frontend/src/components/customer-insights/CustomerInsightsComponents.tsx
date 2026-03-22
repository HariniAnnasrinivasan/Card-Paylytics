import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, DollarSign, Award, PieChart as PieChartIcon } from 'lucide-react';

const COLORS = ['#8b5cf6', '#3b82f6', '#ec4899', '#f59e0b', '#10b981', '#14b8a6', '#6366f1'];

const fmt = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M`
    : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K`
    : n.toString();

const fmtMoney = (n: number) =>
    n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M`
    : n >= 1_000 ? `$${(n / 1_000).toFixed(1)}K`
    : `$${n.toFixed(2)}`;

export function CustomerInsightsKpis({ kpis }: { kpis: any }) {
    if (!kpis) return null;

    const cards = [
        {
            label: 'Total Customers',
            value: fmt(kpis.totalCustomers || 0),
            icon: Users,
            color: 'from-violet-500 to-purple-600',
            bg: 'bg-violet-500/10 border-violet-500/20',
        },
        {
            label: 'Avg Monthly Spend',
            value: fmtMoney(parseFloat(kpis.averageMonthlySpend) || 0),
            icon: DollarSign,
            color: 'from-emerald-500 to-teal-500',
            bg: 'bg-emerald-500/10 border-emerald-500/20',
        },
        {
            label: 'High-Value Customers',
            value: fmt(kpis.highValueCustomers || 0),
            icon: Award,
            color: 'from-orange-400 to-amber-500',
            bg: 'bg-orange-500/10 border-orange-500/20',
        },
        {
            label: 'Most Common Segment',
            value: kpis.mostCommonSegment || 'N/A',
            icon: PieChartIcon,
            color: 'from-blue-500 to-cyan-500',
            bg: 'bg-blue-500/10 border-blue-500/20',
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {cards.map(({ label, value, icon: Icon, color, bg }) => (
                <div
                    key={label}
                    className={`rounded-2xl border p-5 flex flex-col gap-3 ${bg}`}
                    style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}
                >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                        <Icon size={20} className="text-white" />
                    </div>
                    <div>
                        <p className="text-2xl lg:text-3xl font-bold text-white leading-none">{value}</p>
                        <p className="text-purple-300 text-xs mt-1 font-medium">{label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function BarChartCard({ title, data, dataKey, nameKey, color = "#8b5cf6" }: { title: string, data: any[], dataKey: string, nameKey: string, color?: string }) {
    if (!data) return null;
    return (
        <div className="bg-[#1a1c2e] p-6 rounded-xl border border-gray-800" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
            <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis dataKey={nameKey} stroke="#9ca3af" axisLine={false} tickLine={false} />
                        <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ fill: '#374151', opacity: 0.4 }} contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function PieChartCard({ title, data, dataKey, nameKey }: { title: string, data: any[], dataKey: string, nameKey: string }) {
    if (!data) return null;
    return (
        <div className="bg-[#1a1c2e] p-6 rounded-xl border border-gray-800" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
            <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                        <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey={dataKey} nameKey={nameKey} label>
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function HighValueCustomers({ data }: { data: any[] }) {
    if (!data || data.length === 0) return null;
    return (
        <div className="bg-[#1a1c2e] p-6 rounded-xl border border-gray-800 overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
            <h3 className="text-lg font-semibold text-white mb-4">High Value Customers</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-gray-400 border-b border-gray-800">
                            <th className="pb-3 px-4 font-medium">Customer ID</th>
                            <th className="pb-3 px-4 font-medium">Name</th>
                            <th className="pb-3 px-4 font-medium">Segment</th>
                            <th className="pb-3 px-4 font-medium">City</th>
                            <th className="pb-3 px-4 font-medium text-right">Avg Monthly Spend</th>
                        </tr>
                    </thead>
                    <tbody className="text-white text-sm">
                        {data.map((row, idx) => (
                            <tr key={idx} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                                <td className="py-3 px-4 font-mono text-gray-300">#{row.customer_id}</td>
                                <td className="py-3 px-4">{row.first_name} {row.last_name}</td>
                                <td className="py-3 px-4">
                                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400">
                                        {row.segment}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-gray-400">{row.city}</td>
                                <td className="py-3 px-4 font-semibold text-right text-emerald-400">${row.avg_monthly_spend.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
