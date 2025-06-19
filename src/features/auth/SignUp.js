/* ========================================================================== */
/* FILE: src/features/auth/SignUp.js (UPDATED)                                */
/* Now sets subscription details for new users in Firestore.                  */
/* ========================================================================== */
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from '../../lib/firebase';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Create a user document in Firestore with subscription info
            await setDoc(doc(db, "users", userCredential.user.uid), {
                email: userCredential.user.email,
                displayName: '',
                createdAt: new Date(),
                tier: 'Starter',
                competitorLimit: 3, // Starter plan limit
            });
        } catch (err) {
            setError('Failed to create an account. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <form onSubmit={handleSignUp} className="space-y-6">
                <Input label="Email Address" id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Input label="Password" id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6+ characters" required />
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <Button type="submit" fullWidth disabled={isLoading}>{isLoading ? 'Creating Account...' : 'Create Account'}</Button>
            </form>
        </Card>
    );
}