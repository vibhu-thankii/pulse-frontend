/* ========================================================================== */
/* FILE: src/pages/DashboardPage.js (UPDATED & FINAL)                         */
/* Added the new ActivityWidget to fill the empty space.                      */
/* ========================================================================== */
import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import TrendsWidget from '../components/dashboard/TrendsWidget';
import StatsWidget from '../components/dashboard/StatsWidget';
import MarketChartWidget from '../components/dashboard/MarketChartWidget';
import WatchlistWidget from '../components/dashboard/WatchlistWidget';
import HeatmapWidget from '../components/dashboard/HeatmapWidget';
import AiInsightsWidget from '../components/dashboard/AiInsightsWidget';
import ActivityWidget from '../components/dashboard/ActivityWidget'; // NEW WIDGET
import { fetchCompetitors } from '../features/competitors/competitorsSlice';
import { selectUser } from '../features/auth/authSlice';

export default function DashboardPage() {
    const dispatch = useDispatch();
    const { items: allCompetitors, status } = useSelector((state) => state.competitors);
    const searchTerm = useSelector((state) => state.ui.searchTerm);
    const user = useSelector(selectUser);

    useEffect(() => {
        if (user && status === 'idle') {
            dispatch(fetchCompetitors(user.uid));
        }
    }, [user, status, dispatch]);

    const filteredCompetitors = useMemo(() => {
        if (!searchTerm.trim()) {
            return allCompetitors;
        }
        return allCompetitors.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allCompetitors, searchTerm]);

    return (
        <div className="bg-slate-100">
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 p-6">
                    <Header />
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <AiInsightsWidget />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <TrendsWidget competitors={filteredCompetitors} />
                                <StatsWidget competitors={filteredCompetitors} />
                            </div>
                            <MarketChartWidget />
                        </div>
                        <div className="lg:col-span-1">
                            <div className="space-y-6">
                               <WatchlistWidget competitors={filteredCompetitors} />
                               <HeatmapWidget competitors={filteredCompetitors} />
                               {/* NEW WIDGET ADDED HERE */}
                               <ActivityWidget />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
