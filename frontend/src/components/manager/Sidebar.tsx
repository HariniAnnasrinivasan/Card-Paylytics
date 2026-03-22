import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    LogOut,
    ShieldAlert,
    Users,
    Store,
    TrendingUp,
    CreditCard,
    Landmark,
    Target
} from 'lucide-react';

const navItems = [
    { label: 'Overview', icon: LayoutDashboard, path: '/manager-dashboard' },
    { label: 'AI Strategy', icon: Target, path: '/recommendation-dashboard' },
    { label: 'Revenue', icon: TrendingUp, path: '/revenue-dashboard' },
    { label: 'Fraud', icon: ShieldAlert, path: '/fraud-dashboard' },
    { label: 'Merchants', icon: Store, path: '/merchant-dashboard' },
    { label: 'Authorizations', icon: CreditCard, path: '/authorization-dashboard' },
    { label: 'Settlements', icon: Landmark, path: '/settlement-dashboard' },
    { label: 'Customers', icon: Users, path: '/customer-insights-dashboard' },
];

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <aside className="fixed left-0 top-0 h-full w-64 flex flex-col z-20"
            style={{ background: 'linear-gradient(180deg, #2e1065 0%, #3b0764 50%, #1e0546 100%)' }}>
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-purple-800">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)' }}>
                    <span className="text-white font-bold text-lg">V</span>
                </div>
                <div>
                    <p className="text-white font-bold text-sm leading-tight">VisaBank</p>
                    <p className="text-purple-300 text-xs">Intelligence Hub</p>
                </div>
            </div>

            {/* Manager badge */}
            <div className="mx-4 mt-4 px-3 py-2 rounded-lg bg-purple-800/40 border border-purple-700/50">
                <p className="text-purple-300 text-xs font-medium uppercase tracking-wider">Bank Manager</p>
                <p className="text-white text-sm font-semibold">Dashboard</p>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 mt-6 space-y-1">
                {navItems.map(({ label, icon: Icon, path }) => {
                    const active = location.pathname === path;
                    return (
                        <button
                            key={label}
                            onClick={() => navigate(path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                active
                                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                    : 'text-purple-200 hover:bg-purple-800/50 hover:text-white'
                            }`}
                        >
                            <Icon size={18} />
                            {label}
                        </button>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="px-3 pb-6">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-purple-300 hover:bg-red-900/30 hover:text-red-400 transition-all duration-200"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
