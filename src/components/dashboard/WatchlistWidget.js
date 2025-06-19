/* ========================================================================== */
/* FILE: src/components/dashboard/WatchlistWidget.js (UPDATED & FIXED)        */
/* ========================================================================== */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import { MoreHorizontal, Plus, X } from 'lucide-react';
import { addCompetitor, deleteCompetitor } from '../../features/competitors/competitorsSlice';
import { selectUser } from '../../features/auth/authSlice';
import WidgetMenu from '../common/WidgetMenu';

export default function WatchlistWidget({ competitors }) {
    const dispatch = useDispatch();
    const { status, items: allCompetitors, error } = useSelector((state) => state.competitors);
    const user = useSelector(selectUser);

    const [isAdding, setIsAdding] = useState(false);
    const [newCompetitorName, setNewCompetitorName] = useState('');
    const [newCompetitorDomain, setNewCompetitorDomain] = useState('');
    const [isMenuOpen, setMenuOpen] = useState(false);

    const atLimit = user && allCompetitors.length >= user.competitorLimit;

    const handleAddCompetitor = async (e) => {
        e.preventDefault();
        if (newCompetitorName.trim() && newCompetitorDomain.trim() && user && !atLimit) {
            await dispatch(addCompetitor({ userId: user.uid, name: newCompetitorName, domain: newCompetitorDomain }));
            setNewCompetitorName('');
            setNewCompetitorDomain('');
            setIsAdding(false);
        }
    };
    
    const handleDeleteCompetitor = (competitorId) => {
        if (user) dispatch(deleteCompetitor({ userId: user.uid, competitorId }));
    };

    return (
        <Card padding="p-0">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800">Competitor Watchlist</h3>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsAdding(!isAdding)} disabled={atLimit} className="p-1 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"><Plus size={20} className="text-gray-600" /></button>
                        <div className="relative">
                            <button onClick={() => setMenuOpen(!isMenuOpen)} className="p-1 hover:bg-gray-200 rounded-full transition-colors"><MoreHorizontal size={20} className="text-gray-400 cursor-pointer" /></button>
                            {isMenuOpen && <WidgetMenu />}
                        </div>
                    </div>
                </div>
                
                {atLimit && !isAdding && ( <div className="p-3 mb-4 text-center bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800"> You've reached your competitor limit. <a href="/settings" className="font-bold underline">Upgrade to Pro</a> to add more.</div>)}
                {isAdding && (
                     <div className="space-y-3 mb-4">
                        <Input type="text" placeholder="Competitor Name (e.g., Tesla)" value={newCompetitorName} onChange={(e) => setNewCompetitorName(e.target.value)} required autoFocus />
                        <Input type="text" placeholder="Domain (e.g., tesla.com)" value={newCompetitorDomain} onChange={(e) => setNewCompetitorDomain(e.target.value)} required />
                        <Button onClick={handleAddCompetitor} fullWidth disabled={atLimit}>{atLimit ? 'Limit Reached' : 'Add Competitor'}</Button>
                    </div>
                )}
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            </div>
            
            <div className="px-6 pb-4">
                <div className="flex justify-between text-xs text-gray-500 font-bold mb-2 px-2">
                    <span>COMPANY</span>
                    <span className="text-right">INDEXED PAGES</span>
                </div>

                {status === 'loading' && <p className="text-center text-gray-500 py-4">Loading watchlist...</p>}
                {status === 'succeeded' && (
                    <ul className="space-y-1">
                        {competitors.length > 0 ? competitors.map((item) => (
                            <li key={item.id} className="group flex justify-between items-center text-sm p-2 rounded-md hover:bg-gray-50">
                                <span className="font-semibold text-gray-800">{item.name}</span>
                                <div className="flex items-center">
                                    <span className="font-bold text-gray-900 w-24 text-right">{item.value}</span>
                                    <span className={`ml-3 w-14 text-right text-xs font-bold ${item.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>{item.change}</span>
                                    <button onClick={() => handleDeleteCompetitor(item.id)} className="ml-2 -mr-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"><X size={14} className="text-red-500" /></button>
                                </div>
                            </li>
                        )) : allCompetitors.length > 0 ? (
                            <p className="text-center text-gray-500 text-sm py-4">No competitors match your search.</p>
                        ) : (
                            <p className="text-center text-gray-500 text-sm py-4">Your watchlist is empty.</p>
                        )}
                    </ul>
                )}
            </div>
        </Card>
    );
}