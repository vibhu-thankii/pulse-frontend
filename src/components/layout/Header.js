/* ========================================================================== */
/* FILE: src/components/layout/Header.js (UPDATED)                            */
/* All dark mode logic has been removed.                                      */
/* ========================================================================== */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import { setSearchTerm, toggleNotifications, toggleProfileDropdown } from '../../features/ui/uiSlice';
import { Bell, ChevronDown, Search, Settings, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

const NotificationsPanel = () => {
    const notifications = [
        { id: 1, text: "Innovate Inc. just launched a new product line.", time: "2m ago", read: false },
        { id: 2, text: "Your AI Summary for this week is ready.", time: "1h ago", read: false },
        { id: 3, text: "Synergy Corp. mentioned in 5 new articles.", time: "4h ago", read: true },
    ];

    return (
        <div className="absolute top-16 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
            <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.map(n => (
                    <div key={n.id} className="p-4 border-b border-gray-200 hover:bg-gray-50 flex items-start gap-3">
                        {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>}
                        <div className={n.read ? 'opacity-60' : ''}>
                            <p className="text-sm text-gray-700">{n.text}</p>
                            <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                        </div>
                    </div>
                ))}
            </div>
             <div className="p-2 bg-gray-50 text-center">
                 <button className="text-sm font-medium text-primary hover:underline">Mark all as read</button>
             </div>
        </div>
    );
};


const ProfileDropdown = () => {
    //const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            // Redux state will clear automatically via onAuthStateChanged
            navigate('/auth'); // Navigate to auth page after sign out
        } catch (error) {
            console.error("Sign out error", error);
        }
    };

    return (
        <div className="absolute top-16 right-0 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
            <div className="p-2">
                <Link to="/settings" className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">
                    <Settings size={16} />
                    <span>Settings</span>
                </Link>
                <button onClick={handleSignOut} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">
                    <LogOut size={16} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};


export default function Header() {
    const user = useSelector(selectUser);
    const { searchTerm, isNotificationsOpen, isProfileDropdownOpen } = useSelector((state) => state.ui);
    const dispatch = useDispatch();
    
    return (
        <header className="flex items-center justify-between mb-8">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search competitors..." 
                    className="bg-white text-gray-800 rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                    value={searchTerm}
                    onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                />
            </div>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <button onClick={() => dispatch(toggleNotifications())} className="p-2 rounded-full hover:bg-gray-200">
                        <Bell className="text-gray-500" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                     {isNotificationsOpen && <NotificationsPanel />}
                </div>
                <div className="h-8 w-px bg-gray-300"></div>
                <div className="relative">
                    <button onClick={() => dispatch(toggleProfileDropdown())} className="flex items-center gap-2 cursor-pointer">
                        <img src={`https://i.pravatar.cc/32?u=${user?.email}`} alt="User" className="rounded-full" />
                        <span className="font-semibold text-sm text-gray-800">{user?.displayName || user?.email}</span>
                        <ChevronDown size={16} className="text-gray-500" />
                    </button>
                    {isProfileDropdownOpen && <ProfileDropdown />}
                </div>
            </div>
        </header>
    );
}