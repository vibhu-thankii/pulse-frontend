/* ========================================================================== */
/* FILE: src/pages/SettingsPage.js (UPDATED)                                  */
/* Adds a new "Company" tab to manage the user's own company details.         */
/* ========================================================================== */
import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import ProfileSettings from '../components/settings/ProfileSettings';
import AccountSettings from '../components/settings/AccountSettings';
import SubscriptionSettings from '../components/settings/SubscriptionSettings';
import CompanySettings from '../components/settings/CompanySettings'; // New component

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const tabs = ['profile', 'company', 'account', 'subscription'];

    return (
        <div className="bg-slate-100">
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 p-6">
                    <Header />
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Settings</h2>
                        <div className="mb-6 border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                {tabs.map(tab => (
                                    <button key={tab} onClick={() => setActiveTab(tab)} className={`capitalize whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                        {tab}
                                    </button>
                                ))}
                            </nav>
                        </div>
                        <div>
                            {activeTab === 'profile' && <ProfileSettings />}
                            {activeTab === 'company' && <CompanySettings />}
                            {activeTab === 'account' && <AccountSettings />}
                            {activeTab === 'subscription' && <SubscriptionSettings />}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
