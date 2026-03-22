import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { User, MapPin, Briefcase, DollarSign, LogOut } from 'lucide-react';

interface ProfileData {
    first_name: string;
    city: string;
    occupation: string;
    income_bracket: string;
}

export default function ProfileHeader() {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    useEffect(() => {
        api.get('/customer/profile').then(res => {
            setProfile(res.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="h-24 bg-white dark:bg-gray-800 rounded-2xl animate-pulse"></div>;
    if (!profile) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <User size={32} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Welcome back, {profile.first_name}</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Here is your monthly financial overview</p>
                </div>
            </div>

            <div className="flex space-x-6 items-center flex-wrap gap-y-2">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                    <MapPin size={18} className="text-gray-400" />
                    <span className="text-sm font-medium">{profile.city}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                    <Briefcase size={18} className="text-gray-400" />
                    <span className="text-sm font-medium">{profile.occupation}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                    <DollarSign size={18} className="text-gray-400" />
                    <span className="text-sm font-medium">{profile.income_bracket}</span>
                </div>
                <div className="ml-auto pl-4 border-l border-gray-200 dark:border-gray-700">
                    <button 
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 px-3 py-1.5 rounded-lg transition-colors font-semibold text-sm"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
