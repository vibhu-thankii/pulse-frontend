/* ========================================================================== */
/* FILE: src/components/dashboard/StatsWidget.js (FULL CODE)                  */
/* ========================================================================== */
import React, { useState, useMemo } from 'react';
import Card from '../common/Card';
import { MoreHorizontal } from 'lucide-react';
import WidgetMenu from '../common/WidgetMenu';

const ProgressBar = ({ label, value, percentage, color }) => (
    <div>
        <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-700">{label}</span>
            <span className="font-semibold">{value}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={`${color} h-2 rounded-full`} style={{ width: percentage }}></div>
        </div>
    </div>
);

export default function StatsWidget({ competitors }) {
    const [isMenuOpen, setMenuOpen] = useState(false);

    const averageStats = useMemo(() => {
        if (competitors.length === 0) {
            return { sov: 'N/A', sovPercent: '0%', adSpend: '$0/mo', adSpendPercent: '0%', traffic: 'N/A', trafficPercent: '0%' };
        }

        const totalSov = competitors.reduce((acc, c) => acc + (c.social || 0), 0);
        const totalAdSpend = competitors.reduce((acc, c) => acc + (c.adSpend || 0), 0);
        const totalTraffic = competitors.reduce((acc, c) => acc + (parseInt(String(c.value || '0').replace(/,/g, ''), 10) || 0), 0);

        const avgSov = totalSov / competitors.length;
        const avgAdSpend = totalAdSpend / competitors.length;
        const avgTraffic = totalTraffic / competitors.length;
        
        const maxAdSpend = Math.max(...competitors.map(c => c.adSpend || 0), 1);
        const maxTraffic = Math.max(...competitors.map(c => parseInt(String(c.value || '0').replace(/,/g, ''), 10)), 1);

        return {
            sov: `${avgSov.toFixed(1)}%`,
            sovPercent: `${avgSov.toFixed(1)}%`,
            adSpend: `$${(avgAdSpend / 1000).toFixed(1)}k/mo`,
            adSpendPercent: `${Math.min(100, (avgAdSpend / maxAdSpend) * 100).toFixed(0)}%`,
            traffic: avgTraffic.toLocaleString(undefined, { notation: 'compact', compactDisplay: 'short' }),
            trafficPercent: `${Math.min(100, (avgTraffic / maxTraffic) * 100).toFixed(0)}%`,
        };
    }, [competitors]);

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">COMPETITOR AVERAGES</h3>
                <div className="relative">
                    <button onClick={() => setMenuOpen(!isMenuOpen)} className="p-1 hover:bg-gray-200 rounded-full transition-colors"><MoreHorizontal size={20} className="text-gray-400 cursor-pointer" /></button>
                    {isMenuOpen && <WidgetMenu />}
                </div>
            </div>
            <div className="space-y-5">
                <ProgressBar label="Avg. Share of Voice" value={averageStats.sov} percentage={averageStats.sovPercent} color="bg-blue-500" />
                <ProgressBar label="Avg. Ad Spend" value={averageStats.adSpend} percentage={averageStats.adSpendPercent} color="bg-red-500" />
                <ProgressBar label="Avg. Indexed Pages" value={averageStats.traffic} percentage={averageStats.trafficPercent} color="bg-green-500" />
            </div>
        </Card>
    );
}