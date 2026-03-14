import React, { useEffect, useState } from 'react';
import { Store, ArrowRight, Sparkles, Star } from 'lucide-react';
import api from '../api';

interface Recommendation {
    category: string;
    recommendation: string | null;
}

export default function MerchantRecommendations() {
    const [data, setData] = useState<Recommendation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/customer/merchant-recommendations').then(res => {
            setData(res.data);
            setLoading(false);
        }).catch(console.error);
    }, []);

    if (loading) return <div className="h-40 bg-white dark:bg-gray-800 rounded-2xl animate-pulse"></div>;
    if (!data) return null;

    return (
        <div className="bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/60 dark:to-indigo-900/40 rounded-2xl p-6 shadow-xl border border-purple-200 dark:border-purple-500/30 relative overflow-hidden group hover:shadow-purple-500/20 transition-all duration-300">
            {/* Background Decoration */}
            <div className="absolute -top-10 -right-10 text-purple-500/10 dark:text-purple-400/10 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-500">
                <Store size={180} />
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="text-yellow-500" size={20} />
                        <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-300 dark:to-indigo-300">Curated For You ✨</h2>
                    </div>

                    <p className="text-purple-800/80 dark:text-purple-200/80 text-sm font-medium">
                        Since you love shopping at <span className="font-bold border-b border-purple-400/50">{data.category}</span>...
                    </p>
                </div>

                {data.recommendation ? (
                    <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-xl p-5 border border-white/40 dark:border-purple-500/20 shadow-inner mt-2 group-hover:bg-white/80 dark:group-hover:bg-gray-900/80 transition-all cursor-pointer">
                        <div className="flex items-center gap-3 mb-1">
                            <Star className="text-neon-orange fill-neon-orange" size={16} />
                            <p className="text-xs uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400">Featured Partner</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{data.recommendation}</span>
                            <div className="bg-gradient-to-r from-neon-orange to-neon-amber p-2.5 rounded-full text-white shadow-lg group-hover:shadow-neon-orange/50 group-hover:scale-110 transition-all">
                                <ArrowRight size={20} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-purple-700 dark:text-purple-300 italic opacity-80">More exclusive merchant unlocked soon! 🚀</p>
                )}
            </div>
        </div>
    );
}
