import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Callback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const exchangedRef = useRef(false);

    useEffect(() => {
        if (exchangedRef.current) return;

        const code = searchParams.get('code');
        if (!code) {
            setError('No authorization code found in URL');
            return;
        }

        const exchangeCode = async () => {
            exchangedRef.current = true;
            try {
                await axios.post('/api/auth/exchange-code', { code }, { withCredentials: true });
                navigate('/dashboard');
            } catch (err: any) {
                console.error('Failed to exchange code:', err);
                setError('Failed to log in. Please try again.');
                setTimeout(() => navigate('/login'), 3000);
            }
        };

        exchangeCode();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
                {error ? (
                    <div className="text-red-600 font-semibold">{error}</div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-300">Authenticating securely...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
