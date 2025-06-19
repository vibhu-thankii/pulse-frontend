/* ========================================================================== */
/* FILE: src/App.js (UPDATED)                                                 */
/* All dark mode logic has been removed.                                      */
/* ========================================================================== */
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { fetchUserProfile, clearUser } from './features/auth/authSlice';
import { selectUser, selectAuthStatus } from './features/auth/authSlice';

import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ChartsPage from './pages/ChartsPage';
import SettingsPage from './pages/SettingsPage';
import NewsPage from './pages/NewsPage';
import TrendsPage from './pages/TrendsPage';
import MentionsPage from './pages/MentionsPage';
import LandingPage from './pages/LandingPage';

const LoadingScreen = () => <div className="h-screen w-screen flex items-center justify-center bg-slate-100"><h1 className="text-gray-800">Loading Pulse...</h1></div>;

const ProtectedRoute = ({ children }) => {
    const user = useSelector(selectUser);
    const authStatus = useSelector(selectAuthStatus);
    if (authStatus === 'loading') return <LoadingScreen />;
    if (!user) return null;
    return children;
};

const PublicRoute = ({ children }) => {
    const user = useSelector(selectUser);
    const authStatus = useSelector(selectAuthStatus);
    if (authStatus === 'loading') return <LoadingScreen />;
    if (user) return null;
    return children;
}

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const authStatus = useSelector(selectAuthStatus);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        dispatch(fetchUserProfile(authUser.uid));
      } else {
        dispatch(clearUser());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);
  
  useEffect(() => {
    if (authStatus !== 'loading') {
      if (user && (location.pathname === '/' || location.pathname.startsWith('/auth'))) {
        navigate('/dashboard');
      } else if (!user && !location.pathname.startsWith('/auth')) {
        navigate('/');
      }
    }
  }, [user, authStatus, navigate, location.pathname]);

  if (authStatus === 'loading' && !user) {
    return <LoadingScreen />;
  }

  return (
    <div>
        <Routes>
            <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
            <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/charts" element={<ProtectedRoute><ChartsPage /></ProtectedRoute>} />
            <Route path="/trends" element={<ProtectedRoute><TrendsPage /></ProtectedRoute>} />
            <Route path="/mentions" element={<ProtectedRoute><MentionsPage /></ProtectedRoute>} />
            <Route path="/news" element={<ProtectedRoute><NewsPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/*" element={user ? <DashboardPage /> : <LandingPage />} />
        </Routes>
    </div>
  );
}

export default App;