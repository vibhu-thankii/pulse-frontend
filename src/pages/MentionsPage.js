/* ========================================================================== */
/* FILE: src/pages/MentionsPage.js (NEW FILE)                                 */
/* A new page to display a detailed feed of competitor news mentions.         */
/* ========================================================================== */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import Card from '../components/common/Card';
import { fetchCompetitorNews } from '../features/news/newsSlice';
import { Clock } from 'lucide-react';

export default function MentionsPage() {
    const dispatch = useDispatch();
    const { items: competitors } = useSelector((state) => state.competitors);
    const { competitorNews, competitorNewsStatus, error } = useSelector((state) => state.news);

    // Flatten all articles into a single sorted list
    const allMentions = React.useMemo(() => {
        return Object.values(competitorNews)
            .flat()
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    }, [competitorNews]);

    useEffect(() => {
        if (competitors.length > 0 && competitorNewsStatus === 'idle') {
            const competitorNames = competitors.map(c => c.name);
            dispatch(fetchCompetitorNews(competitorNames));
        }
    }, [competitors, competitorNewsStatus, dispatch]);
    
    return (
        <div className="flex min-h-screen bg-slate-100 font-sans text-gray-800">
            <Sidebar />
            <main className="flex-1 p-6">
                <Header />
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">Mentions Feed</h2>
                </div>
                
                <Card>
                    {competitorNewsStatus === 'loading' && <p>Loading mentions...</p>}
                    {competitorNewsStatus === 'failed' && <p className="text-red-500">{error}</p>}
                    {competitorNewsStatus === 'succeeded' && (
                        competitors.length > 0 ? (
                            <div className="space-y-6">
                                {allMentions.map((article, index) => (
                                     <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-gray-900 hover:text-primary transition-colors">{article.title}</a>
                                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                                            <span>Source: <strong>{article.source.name}</strong></span>
                                            <span className="flex items-center gap-1"><Clock size={12}/> {new Date(article.publishedAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-gray-700 mt-2">{article.description}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-16">
                                <p className="text-gray-600">Add competitors to your watchlist to populate the mentions feed.</p>
                            </div>
                        )
                    )}
                </Card>
            </main>
        </div>
    );
}
