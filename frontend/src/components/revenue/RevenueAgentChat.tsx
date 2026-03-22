import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot } from 'lucide-react';
import api from '../../api';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function RevenueAgentChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hello! I am your Revenue Intelligence Agent. How can I help you analyze your performance today?' }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const res = await api.post('/revenue/agent', { prompt: userMsg });
            setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
        } catch (err: any) {
            console.error('Chat error:', err);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error connecting to the intelligence engine.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 shadow-xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-200 border-2 border-white/20"
            >
                {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-[400px] h-[550px] bg-[#0f0e2d]/90 border border-purple-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="p-5 bg-gradient-to-r from-purple-600/30 to-orange-500/10 border-b border-purple-500/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                                <Bot size={22} className="text-white" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">Revenue Intelligence Agent</p>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    <span className="text-purple-300 text-[10px] font-medium uppercase tracking-widest">Active • AWS Bedrock</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-purple-300 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5 scroll-smooth">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                                    msg.role === 'user' 
                                        ? 'bg-purple-600 text-white rounded-tr-none shadow-lg shadow-purple-600/10' 
                                        : 'bg-white/5 text-purple-100 border border-white/10 rounded-tl-none backdrop-blur-md'
                                }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/10 flex gap-1.5 items-center">
                                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-duration:1s]"></span>
                                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.2s]"></span>
                                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-5 bg-white/5 border-t border-purple-500/10">
                        <div className="relative group">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about revenue trends, costs..."
                                className="w-full bg-[#1a1945] border border-purple-500/20 rounded-2xl pl-5 pr-14 py-3.5 text-white text-sm placeholder:text-purple-400/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all shadow-inner"
                            />
                            <button
                                onClick={handleSend}
                                disabled={loading || !input.trim()}
                                className={`absolute right-2 top-1.5 bottom-1.5 px-3 rounded-xl flex items-center justify-center transition-all ${
                                    input.trim() && !loading 
                                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95' 
                                        : 'bg-purple-900/50 text-purple-500 cursor-not-allowed'
                                }`}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                        <p className="text-[9px] text-center text-purple-400/40 mt-3 font-medium tracking-tight">POWERED BY VISA BANK INTELLIGENCE HUB</p>
                    </div>
                </div>
            )}
        </div>
    );
}

