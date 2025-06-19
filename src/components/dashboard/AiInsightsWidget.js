/* ========================================================================== */
/* FILE: src/components/dashboard/AiInsightsWidget.js (UPDATED)               */
/* ========================================================================== */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../common/Card';
import { selectUser } from '../../features/auth/authSlice';
import { generateCompetitorSummary } from '../../features/competitors/competitorsSlice';
import { Sparkles, Star, MoreHorizontal } from 'lucide-react';
import WidgetMenu from '../common/WidgetMenu';

export default function AiInsightsWidget() {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const { items: competitors, summary, summaryStatus, error } = useSelector((state) => state.competitors);
    const [isMenuOpen, setMenuOpen] = useState(false);

    const isProUser = user?.tier === 'Pro';

    useEffect(() => {
        if (isProUser && competitors.length > 0 && summaryStatus === 'idle') {
            const competitorNames = competitors.map(c => c.name).join(', ');
            dispatch(generateCompetitorSummary(competitorNames));
        }
    }, [isProUser, competitors, summaryStatus, dispatch]);

    const UpgradePrompt = () => (
        <div className="text-center p-8">
            <div className="mx-auto bg-primary-light h-12 w-12 rounded-full flex items-center justify-center">
                <Star className="text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-800">Unlock AI-Powered Summaries</h3>
            <p className="mt-2 text-sm text-gray-600">Get weekly AI-generated reports on your competitors' activities by upgrading to our Pro plan.</p>
            <a href="/settings" className="mt-4 inline-block bg-primary text-white font-medium px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors">
                Upgrade to Pro
            </a>
        </div>
    );

    const AiSummary = () => (
         <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Sparkles className="text-primary" />
                    AI Competitive Summary
                </h3>
                 <div className="relative">
                    <button onClick={() => setMenuOpen(!isMenuOpen)} className="p-1 hover:bg-gray-200 rounded-full transition-colors"><MoreHorizontal size={20} className="text-gray-400 cursor-pointer" /></button>
                    {isMenuOpen && <WidgetMenu onClose={() => setMenuOpen(false)} />}
                </div>
            </div>
            {summaryStatus === 'loading' && <p className="text-gray-600">Generating insights...</p>}
            {summaryStatus === 'failed' && <p className="text-red-500">{error}</p>}
            {summaryStatus === 'succeeded' && <p className="text-gray-700 leading-relaxed">{summary}</p>}
        </div>
    );

    return (
        <Card>
            {isProUser ? <AiSummary /> : <UpgradePrompt />}
        </Card>
    );
}