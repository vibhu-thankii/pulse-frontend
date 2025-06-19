/* ========================================================================== */
/* FILE: src/components/settings/ProfileSettings.js                           */
/* This file is needed by the Settings Page.                                  */
/* ========================================================================== */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, fetchUserProfile } from '../../features/auth/authSlice';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';

export default function ProfileSettings() {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const [name, setName] = useState(user?.displayName || '');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        
        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                displayName: name,
            });
            // Re-fetch user profile to update the state everywhere
            await dispatch(fetchUserProfile(user.uid));
            setMessage('Profile updated successfully!');
        } catch (error) {
            setMessage('Failed to update profile. Please try again.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
                <Input
                    label="Full Name"
                    id="full-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                />
                <Input
                    label="Email Address"
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    readOnly
                />
                 {message && <p className="text-sm text-green-600">{message}</p>}
                <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
