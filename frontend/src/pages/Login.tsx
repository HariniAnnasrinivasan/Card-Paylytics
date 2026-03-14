import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to login');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-2xl">V</span>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">VisaBank Insights</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 text-center">Sign in to your account</p>

                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-center">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input 
                            type="email" 
                            required 
                            className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                        <input 
                            type="password" 
                            required 
                            className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    );
}
