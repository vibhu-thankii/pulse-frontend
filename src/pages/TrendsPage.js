/* ========================================================================== */
/* FILE: src/pages/TrendsPage.js (NEW FILE)                                   */
/* A new page for exploring news volume trends on any topic.                  */
/* ========================================================================== */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import Card from '../components/common/Card';

import Button from '../components/common/Button';
import { fetchTrendData } from '../features/news/newsSlice';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search } from 'lucide-react';

export default function TrendsPage() {
    const dispatch = useDispatch();
    const { trendData, trendStatus, error } = useSelector((state) => state.news);
    const [topic, setTopic] = useState('SaaS');
    const [inputTopic, setInputTopic] = useState('SaaS');

    useEffect(() => {
        // Fetch data for the default topic on initial load
        if (trendStatus === 'idle') {
            dispatch(fetchTrendData(topic));
        }
    }, [trendStatus, dispatch, topic]);

    const handleSearch = (e) => {
        e.preventDefault();
        setTopic(inputTopic);
        dispatch(fetchTrendData(inputTopic));
    };

    return (
        <div className="flex min-h-screen bg-slate-100 font-sans text-gray-800">
            <Sidebar />
            <main className="flex-1 p-6">
                <Header />
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">Market Trends</h2>
                </div>
                
                <Card>
                    <form onSubmit={handleSearch} className="flex items-center gap-4 mb-6">
                         <div className="relative flex-grow">
                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                             <input 
                                type="text" 
                                placeholder="Search for a trend (e.g., 'Fintech')" 
                                className="bg-white rounded-lg pl-10 pr-4 py-3 w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                value={inputTopic}
                                onChange={(e) => setInputTopic(e.target.value)}
                            />
                        </div>
                        <Button type="submit" disabled={trendStatus === 'loading'}>
                            {trendStatus === 'loading' ? 'Searching...' : 'Search'}
                        </Button>
                    </form>

                     <h3 className="font-bold text-gray-800 mb-4">Daily News Mentions for: "{topic}"</h3>
                     <div className="h-96">
                        {trendStatus === 'loading' && <div className="flex items-center justify-center h-full">Loading Chart Data...</div>}
                        {trendStatus === 'failed' && <div className="flex items-center justify-center h-full text-red-500">{error}</div>}
                        {trendStatus === 'succeeded' && (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="trendColor" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                                    <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false}/>
                                    <Tooltip />
                                    <Area type="monotone" dataKey="Mentions" stroke="#8884d8" strokeWidth={2} fillOpacity={1} fill="url(#trendColor)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </Card>
            </main>
        </div>
    );
}
