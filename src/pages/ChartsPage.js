/* ========================================================================== */
/* FILE: src/pages/ChartsPage.js (UPDATED & FIXED)                            */
/* This is the final version with all chart layout issues corrected.          */
/* ========================================================================== */
import React from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Card from '../components/common/Card';

// A formatter function to make large numbers readable (e.g., 1,000,000 -> 1M)
const formatYAxisTick = (tick) => {
    if (tick >= 1000000) {
        return `${tick / 1000000}M`;
    }
    if (tick >= 1000) {
        return `${tick / 1000}K`;
    }
    return tick;
};


const CompetitorBarChart = () => {
    const { items: competitors } = useSelector((state) => state.competitors);
    
    // Using more varied mock data to demonstrate chart functionality better
    const chartData = competitors.map(c => ({
        name: c.name,
        Social: Math.floor(Math.random() * 2000000) + 500000,
        SEO: Math.floor(Math.random() * 5000000) + 1000000,
        News: Math.floor(Math.random() * 1000000) + 200000,
    }));

    return (
        // FIXED: Using a flex column layout to contain the legend properly
        <Card className="h-96 flex flex-col">
            <h3 className="font-bold text-gray-800 mb-4 flex-shrink-0">Focus Area Comparison</h3>
            <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={formatYAxisTick} tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(value) => value.toLocaleString()} />
                        <Legend />
                        <Bar dataKey="Social" stackId="a" fill="#3B82F6" />
                        <Bar dataKey="SEO" stackId="a" fill="#10B981" />
                        <Bar dataKey="News" stackId="a" fill="#F59E0B" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

const CompetitorRadarChart = () => {
    const { items: competitors } = useSelector((state) => state.competitors);
    
    // Using more distinct and meaningful data to make the radar chart visible
    const chartData = competitors.map(c => ({
        subject: c.name,
        "Innovation Score": Math.floor(Math.random() * 50 + 45), // Score out of 100
        "Market Presence": Math.floor(Math.random() * 60 + 30), // Score out of 100
        fullMark: 100,
    }));

    return (
        // FIXED: Using a flex column layout to contain the legend properly
        <Card className="h-96 flex flex-col">
            <h3 className="font-bold text-gray-800 mb-4 flex-shrink-0">Attribute Radar</h3>
            <div className="flex-grow">
                 <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }}/>
                        <PolarRadiusAxis domain={[0, 100]}/>
                        <Tooltip />
                        <Legend />
                        <Radar name="Innovation" dataKey="Innovation Score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                        <Radar name="Market Presence" dataKey="Market Presence" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default function ChartsPage() {
    return (
        <div className="bg-slate-100">
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 p-6">
                    <Header />
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-900">Charts</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <CompetitorBarChart />
                        <CompetitorRadarChart />
                    </div>
                </main>
            </div>
        </div>
    );
}