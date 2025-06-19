/* ========================================================================== */
/* FILE: src/components/settings/AccountSettings.js                           */
/* This file is also needed by the Settings Page.                             */
/* ========================================================================== */
import React, { useState } from 'react';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';

export default function AccountSettings() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        const user = auth.currentUser;
        if (!user) {
            setError('No user is signed in.');
            setIsLoading(false);
            return;
        }

        const credential = EmailAuthProvider.credential(user.email, currentPassword);

        try {
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            setMessage('Password updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
        } catch (err) {
            console.error(err);
            setError('Failed to update password. Please check your current password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <form onSubmit={handleChangePassword} className="space-y-6">
                 <h3 className="text-lg font-medium leading-6 text-gray-900">Change Password</h3>
                <Input
                    label="Current Password"
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />
                <Input
                    label="New Password"
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="6+ characters"
                    required
                />
                {message && <p className="text-sm text-green-600">{message}</p>}
                {error && <p className="text-sm text-red-500">{error}</p>}
                <div className="flex justify-end">
                     <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
