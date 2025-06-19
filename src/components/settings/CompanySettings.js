/* ========================================================================== */
/* FILE: src/components/settings/CompanySettings.js (NEW FILE)                */
/* ========================================================================== */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, fetchUserProfile } from '../../features/auth/authSlice';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';

export default function CompanySettings() {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const [companyName, setCompanyName] = useState('');
    const [companyDomain, setCompanyDomain] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user?.company) {
            setCompanyName(user.company.name || '');
            setCompanyDomain(user.company.domain || '');
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        
        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                company: {
                    name: companyName,
                    domain: companyDomain,
                }
            });
            // Re-fetch user profile to update the state everywhere
            await dispatch(fetchUserProfile(user.uid));
            setMessage('Company details updated successfully!');
        } catch (error) {
            setMessage('Failed to update company details.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Your Company Details</h3>
                <p className="text-sm text-gray-600 -mt-4">This information will be used to compare your company against competitors.</p>
                <Input
                    label="Company Name"
                    id="company-name"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your Company Inc."
                    required
                />
                <Input
                    label="Company Domain"
                    id="company-domain"
                    type="text"
                    value={companyDomain}
                    onChange={(e) => setCompanyDomain(e.target.value)}
                    placeholder="yourcompany.com"
                    required
                />
                 {message && <p className="text-sm text-green-600">{message}</p>}
                <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Company Details'}
                    </Button>
                </div>
            </form>
        </Card>
    );
}

