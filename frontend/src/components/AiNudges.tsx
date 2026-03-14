import React, { useEffect, useState } from 'react';
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import api from '../api';

interface Nudge {
    nudge_type: string;
    nudge_text: string;
}

export default function AiNudges() {
    const [nudges, setNudges] = useState<Nudge[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/customer/nudges').then(res => {
            setNudges(res.data);
            setLoading(false);
        }).catch(console.error);
    }, []);

    if (loading) return <div className="h-64 bg-white dark:bg-gray-800 rounded-2xl animate-pulse"></div>;

    const getIcon = (type: string) => {
        if (type.toLowerCase().includes('overspending') || type.toLowerCase().includes('alert')) return <AlertTriangle className="text-neon-orange" size={20} />;
        if (type.toLowerCase().includes('positive') || type.toLowerCase().includes('good')) return <CheckCircle className="text-neon-green" size={20} />;
        if (type.toLowerCase().includes('trend') || type.toLowerCase().includes('pattern')) return <TrendingUp className="text-neon-cyan" size={20} />;
        return <Lightbulb className="text-neon-amber" size={20} />;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
                <Lightbulb className="text-neon-amber" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">AI Insights & Nudges</h2>
            </div>

            <div className="space-y-4">
                {nudges.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No new insights at this time.</p>
                ) : (
                    nudges.map((nudge, idx) => {
                        // Split combined text by '. ' to create individual cards
                        const statements = nudge.nudge_text.split(/(?<=\.)\s+/).filter(Boolean);
                        return (
                            <React.Fragment key={idx}>
                                {statements.map((statement, sIdx) => (
                                    <div key={`${idx}-${sIdx}`} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border-l-4 border-l-neon-amber border border-transparent shadow-sm flex items-start space-x-4">
                                        <div className="mt-1 flex-shrink-0 bg-gray-950 p-2 rounded-full border border-gray-700">
                                            {getIcon(nudge.nudge_type)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed tracking-wide">
                                                {statement}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </React.Fragment>
                        );
                    })
                )}
            </div>
        </div>
    );
}
