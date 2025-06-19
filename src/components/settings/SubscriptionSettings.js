/* ========================================================================== */
/* FILE: src/components/settings/SubscriptionSettings.js (FIXED)              */
/* The check for the user's tier is now case-insensitive.                     */
/* ========================================================================== */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, updateUserTier } from '../../features/auth/authSlice';
import Card from '../common/Card';
import Button from '../common/Button';
import { CheckCircle, Star, X } from 'lucide-react';

const UpgradeModal = ({ onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
            <Card className="w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                     <h3 className="text-lg font-medium leading-6 text-gray-900">Confirm Your Upgrade</h3>
                     <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>
                <div className="mt-4">
                    <p className="text-sm text-gray-600">You are about to upgrade to the <span className="font-bold text-primary">Pro Plan</span> for $49/month.</p>
                    <p className="text-sm text-gray-600 mt-2">A real application would now ask for your payment details via Stripe or another payment provider.</p>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <Button onClick={onClose} className="bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</Button>
                    <Button onClick={onConfirm}>Confirm & Upgrade</Button>
                </div>
            </Card>
        </div>
    );
};


export default function SubscriptionSettings() {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);

    const handleConfirmUpgrade = async () => {
        setIsLoading(true);
        setModalOpen(false);
        await dispatch(updateUserTier({ userId: user.uid, tier: 'Pro', limit: 50 }));
        setIsLoading(false);
    };

    return (
        <>
            {isModalOpen && <UpgradeModal onClose={() => setModalOpen(false)} onConfirm={handleConfirmUpgrade} />}
            <Card>
                 <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">Your Subscription</h3>
                 <p className="text-sm text-gray-600 mb-6">Manage your plan and billing details.</p>
                 
                 <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-600">Current Plan</p>
                            <p className="text-2xl font-bold text-gray-900 flex items-center gap-2 capitalize">
                               {user?.tier.toLowerCase() === 'pro' && <Star className="text-amber-400" fill="currentColor" />}
                               {user?.tier}
                            </p>
                        </div>
                        {user?.tier.toLowerCase() === 'starter' && (
                            <Button onClick={() => setModalOpen(true)} disabled={isLoading}>
                                {isLoading ? 'Upgrading...' : 'Upgrade to Pro'}
                            </Button>
                        )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="font-semibold text-gray-800">Features</p>
                         <ul className="mt-2 space-y-2 text-sm text-gray-600">
                            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Track up to {user?.competitorLimit} competitors</li>
                            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Real-time news monitoring</li>
                            {user?.tier.toLowerCase() === 'pro' ? (
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> AI-Powered weekly summaries</li>
                            ) : (
                                <li className="flex items-center gap-2 text-gray-400"><CheckCircle size={16} /> AI-Powered weekly summaries</li>
                            )}
                        </ul>
                    </div>
                 </div>
            </Card>
        </>
    );
}
