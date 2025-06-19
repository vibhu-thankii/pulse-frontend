/* ========================================================================== */
/* FILE: src/components/dashboard/HeatmapWidget.js (UPDATED & FIXED)          */
/* ========================================================================== */
import React, { useState } from 'react';
import Card from '../common/Card';
import { MoreHorizontal } from 'lucide-react';
import WidgetMenu from '../common/WidgetMenu';

const LegendItem = ({ color, label }) => (
    <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-sm ${color}`}></div>
        <span className="text-xs text-gray-600">{label}</span>
    </div>
);

export default function HeatmapWidget({ competitors }) {
    const [isMenuOpen, setMenuOpen] = useState(false);

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Focus Heatmap</h3>
                 <div className="relative">
                    <button onClick={() => setMenuOpen(!isMenuOpen)} className="p-1 hover:bg-gray-200 rounded-full transition-colors"><MoreHorizontal size={20} className="text-gray-400 cursor-pointer" /></button>
                    {isMenuOpen && <WidgetMenu />}
                </div>
            </div>
            <div className="space-y-3">
                 {competitors.length > 0 ? competitors.map((item) => {
                    const total = (item.social || 0) + (item.seo || 0) + (item.news || 0);
                    const socialPercent = total > 0 ? (item.social / total) * 100 : 33.3;
                    const seoPercent = total > 0 ? (item.seo / total) * 100 : 33.3;
                    const newsPercent = total > 0 ? (item.news / total) * 100 : 33.3;

                    return (
                        <div key={item.id}>
                            <p className="text-sm font-semibold mb-1 text-gray-800">{item.name}</p>
                            <div className="flex h-7 rounded-md overflow-hidden bg-gray-200" title={`Social: ${Math.round(socialPercent)}%, SEO: ${Math.round(seoPercent)}%, News: ${Math.round(newsPercent)}%`}>
                                <div className="bg-blue-500" style={{ width: `${socialPercent}%` }}></div>
                                <div className="bg-green-500" style={{ width: `${seoPercent}%` }}></div>
                                <div className="bg-amber-500" style={{ width: `${newsPercent}%` }}></div>
                            </div>
                        </div>
                    );
                }) : (
                    <p className="text-center text-gray-500 text-sm py-4">Add a competitor to see data.</p>
                )}
            </div>
            <div className="flex justify-around mt-4 pt-4 border-t border-gray-200">
                <LegendItem color="bg-blue-500" label="Social" />
                <LegendItem color="bg-green-500" label="SEO" />
                <LegendItem color="bg-amber-500" label="News" />
            </div>
        </Card>
    );
}