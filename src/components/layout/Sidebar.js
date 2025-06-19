import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { clearUser } from '../../features/auth/authSlice';
import { fetchHeadlines } from '../../features/news/newsSlice'; // Import the thunk
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, BarChart3, TrendingUp, MessagesSquare, 
    Newspaper, Settings, LogOut, Flame
} from 'lucide-react';

export default function Sidebar() {
    const dispatch = useDispatch();
    const location = useLocation();
    const { headlines, headlinesStatus, error } = useSelector((state) => state.news);

    useEffect(() => {
        // Fetch headlines only once when the component mounts
        if (headlinesStatus === 'idle') {
            dispatch(fetchHeadlines());
        }
    }, [headlinesStatus, dispatch]);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            dispatch(clearUser());
        } catch (error) {
            console.error("Sign out error", error);
        }
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: BarChart3, label: 'Charts', path: '/charts' },
        { icon: TrendingUp, label: 'Trends', path: '/trends' },
        { icon: MessagesSquare, label: 'Mentions', path: '/mentions' },
        { icon: Newspaper, label: 'News', path: '/news' },
    ];
    
    const settingsItem = { icon: Settings, label: 'Settings', path: '/settings' };

    return (
        <aside className="w-64 bg-white p-6 flex flex-col justify-between shadow-lg">
            {/* Top Section */}
            <div>
                 {/* Logo, Nav, etc. remain the same */}
                 <div className="flex items-center gap-3 mb-10">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 0L32 16L16 32L0 16L16 0Z" fill="#4F46E5" /><path d="M16 6L26 16L16 26L6 16L16 6Z" fill="white" /></svg>
                    <h1 className="text-xl font-bold text-gray-900">Pulse</h1>
                </div>

                <nav>
                    <h2 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-wider">Management</h2>
                    <ul className="space-y-2">
                        {navItems.map((item) => {
                            const isActive = location.pathname.startsWith(item.path);
                            return <li key={item.label}><Link to={item.path} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors text-sm font-medium ${isActive ? 'bg-primary-light text-primary font-bold' : 'hover:bg-gray-100'}`}><item.icon size={20} /><span>{item.label}</span></Link></li>;
                        })}
                    </ul>
                </nav>

                <div className="mt-8">
                    <h2 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-wider flex items-center"><Flame className="mr-2 text-orange-500" size={16} />Hot News</h2>
                    <div className="space-y-4 text-sm">
                        {headlinesStatus === 'loading' && <p>Loading news...</p>}
                        {headlinesStatus === 'failed' && <p className="text-red-500 text-xs">{error}</p>}
                        {headlinesStatus === 'succeeded' && headlines.map((article, index) => (
                            <div key={index}>
                                <a href={article.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-800 hover:text-primary transition-colors">{article.title}</a>
                                <p className="text-xs text-gray-500">{article.source.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div>
                <ul className="space-y-2">
                     <li><Link to={settingsItem.path} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors text-sm font-medium ${location.pathname.startsWith(settingsItem.path) ? 'bg-primary-light text-primary font-bold' : 'hover:bg-gray-100'}`}><settingsItem.icon size={20} /><span>{settingsItem.label}</span></Link></li>
                     <li><button onClick={handleSignOut} className="w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-red-50 text-gray-600 hover:text-red-600 text-sm font-medium"><LogOut size={20} /><span>Sign Out</span></button></li>
                </ul>
            </div>
        </aside>
    );
};