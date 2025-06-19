/* ========================================================================== */
/* FILE: src/pages/NewsPage.js (NEW FILE)                                     */
/* This is the new page for displaying news about tracked competitors.        */
/* ========================================================================== */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { fetchCompetitorNews } from '../features/news/newsSlice';
import { Clock } from 'lucide-react';

// A component to display news articles for a single competitor
const NewsCard = ({ competitorName, articles, status }) => {
    if (status === 'loading') {
        return (
             <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg text-gray-800 mb-4">{competitorName}</h3>
                <p>Loading news...</p>
            </div>
        );
    }
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg text-gray-800 mb-4">{competitorName}</h3>
            {articles && articles.length > 0 ? (
                <div className="space-y-4">
                    {articles.map((article, index) => (
                        <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                            <a href={article.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-900 hover:text-primary transition-colors">{article.title}</a>
                             <p className="text-sm text-gray-600 mt-1">{article.description}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                               <span>{article.source.name}</span>
                               <span className="flex items-center gap-1">
                                    <Clock size={12}/>
                                    {new Date(article.publishedAt).toLocaleDateString()}
                               </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500">No recent news found for this competitor.</p>
            )}
        </div>
    );
};


export default function NewsPage() {
    const dispatch = useDispatch();
    const { items: competitors } = useSelector((state) => state.competitors);
    const { competitorNews, competitorNewsStatus } = useSelector((state) => state.news);

    useEffect(() => {
        // Fetch news only if we have competitors and the status is idle.
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
                    <h2 className="text-3xl font-bold text-gray-900">Competitor News</h2>
                </div>
                
                {competitors.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {competitors.map(competitor => (
                           <NewsCard 
                                key={competitor.id}
                                competitorName={competitor.name}
                                articles={competitorNews[competitor.name]}
                                status={competitorNewsStatus}
                           />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-gray-600">Add competitors to your watchlist to see news about them here.</p>
                    </div>
                )}
            </main>
        </div>
    );
}