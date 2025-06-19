/* ========================================================================== */
/* FILE: src/components/dashboard/MarketChartWidget.js (UPDATED)              */
/* ========================================================================== */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../common/Card';
import { MoreHorizontal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchNewsVolume } from '../../features/news/newsSlice';
import WidgetMenu from '../common/WidgetMenu';

export default function MarketChartWidget() {
    const dispatch = useDispatch();
    const { volume: marketChartData, volumeStatus, error } = useSelector((state) => state.news);
    const [isMenuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (volumeStatus === 'idle') {
            dispatch(fetchNewsVolume());
        }
    }, [volumeStatus, dispatch]);
    
    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Market Trend: 'SaaS' Mentions</h3>
                <div className="relative">
                    <button onClick={() => setMenuOpen(!isMenuOpen)} className="p-1 hover:bg-gray-200 rounded-full transition-colors"><MoreHorizontal size={20} className="text-gray-400 cursor-pointer" /></button>
                    {isMenuOpen && <WidgetMenu onClose={() => setMenuOpen(false)} />}
                </div>
            </div>
            <div className="h-72">
                {volumeStatus === 'loading' && <div className="flex items-center justify-center h-full">Loading Chart Data...</div>}
                {volumeStatus === 'failed' && <div className="flex items-center justify-center h-full text-red-500">{error}</div>}
                {volumeStatus === 'succeeded' && (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={marketChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <defs><linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4}/><stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/></linearGradient></defs>
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#6B7280" />
                            <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false}/>
                            <Tooltip />
                            <Area type="monotone" dataKey="Mentions" stroke="#4F46E5" strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </Card>
    );
}