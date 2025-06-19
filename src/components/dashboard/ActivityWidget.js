/* ========================================================================== */
/* FILE: src/components/dashboard/ActivityWidget.js (NEW FILE)                */
/* This new widget displays a feed of recent events.                          */
/* ========================================================================== */
import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Card from '../common/Card';
import WidgetMenu from '../common/WidgetMenu';
import { MoreHorizontal, PlusCircle, Newspaper } from 'lucide-react';

export default function ActivityWidget() {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const { items: competitors } = useSelector((state) => state.competitors);
    const { headlines } = useSelector((state) => state.news);

    // Combine and sort activities from different sources
    const activityFeed = useMemo(() => {
        const competitorActivities = competitors.map(c => ({
            id: `comp-${c.id}`,
            type: 'ADD_COMPETITOR',
            text: `You started tracking`,
            subject: c.name,
            timestamp: c.createdAt,
            icon: <PlusCircle className="text-blue-500" size={18}/>
        }));
        
        const newsActivities = headlines.slice(0, 2).map(n => ({
            id: `news-${n.url}`,
            type: 'NEWS_HEADLINE',
            text: n.title,
            subject: n.source.name,
            timestamp: n.publishedAt,
            icon: <Newspaper className="text-gray-500" size={18} />
        }));

        return [...competitorActivities, ...newsActivities]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 5); // Show top 5 recent activities

    }, [competitors, headlines]);

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Recent Activity</h3>
                 <div className="relative">
                    <button onClick={() => setMenuOpen(!isMenuOpen)} className="p-1 hover:bg-gray-200 rounded-full transition-colors"><MoreHorizontal size={20} className="text-gray-400 cursor-pointer" /></button>
                    {isMenuOpen && <WidgetMenu />}
                </div>
            </div>
            <div className="space-y-4">
                {activityFeed.length > 0 ? activityFeed.map(activity => (
                    <div key={activity.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 flex-shrink-0 bg-slate-100 rounded-full flex items-center justify-center">
                            {activity.icon}
                        </div>
                        <div>
                            <p className="text-sm text-gray-800">
                                {activity.text} <span className="font-bold">{activity.subject}</span>
                            </p>
                             <p className="text-xs text-gray-500">
                                {new Date(activity.timestamp).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                )) : (
                     <p className="text-center text-gray-500 text-sm py-4">No recent activity.</p>
                )}
            </div>
        </Card>
    );
}
