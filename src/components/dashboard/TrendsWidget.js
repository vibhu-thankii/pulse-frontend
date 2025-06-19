/* ========================================================================== */
/* FILE: src/components/dashboard/TrendsWidget.js (FULL CODE)                 */
/* ========================================================================== */
import React, { useState, useMemo } from 'react';
import Card from '../common/Card';
import { MoreHorizontal } from 'lucide-react';
import WidgetMenu from '../common/WidgetMenu';

const Gauge = ({ value, label }) => {
    const clampedValue = Math.max(0, Math.min(100, value));
    const circumference = 251.2;
    const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

    return (
        <div className="relative w-full max-w-[250px] mx-auto">
            <svg viewBox="0 0 200 100" className="w-full">
                <path d="M 20 100 A 80 80 0 0 1 180 100" stroke="#E5E7EB" strokeWidth="20" fill="none" />
                <path d="M 20 100 A 80 80 0 0 1 180 100" stroke="url(#sentimentGradient)" strokeWidth="20" fill="none" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}/>
                <defs><linearGradient id="sentimentGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#ef4444" /><stop offset="50%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#22c55e" /></linearGradient></defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-3">
                <span className="text-3xl font-bold text-gray-800">{Math.round(clampedValue)}%</span>
                <p className="text-sm text-gray-500 font-medium tracking-wide">{label}</p>
            </div>
        </div>
    );
};

export default function TrendsWidget({ competitors }) {
    const [isMenuOpen, setMenuOpen] = useState(false);

    const averageSentiment = useMemo(() => {
        if (competitors.length === 0) return 50;
        const totalSentiment = competitors.reduce((acc, c) => acc + (c.changeType === 'positive' ? 85 : 15), 0);
        return totalSentiment / competitors.length;
    }, [competitors]);
    
    const getSentimentLabel = (value) => {
        if (value > 66) return 'POSITIVE';
        if (value < 33) return 'NEUTRAL';
        return 'NEGATIVE';
    }

    return (
        <Card>
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-gray-800">SENTIMENT TRENDS</h3>
                <div className="relative">
                    <button onClick={() => setMenuOpen(!isMenuOpen)} className="p-1 hover:bg-gray-200 rounded-full transition-colors"><MoreHorizontal size={20} className="text-gray-400 cursor-pointer" /></button>
                    {isMenuOpen && <WidgetMenu />}
                </div>
            </div>
            <div className="flex items-center justify-center h-full pt-2">
                 <Gauge value={averageSentiment} label={getSentimentLabel(averageSentiment)} />
            </div>
        </Card>
    );
}