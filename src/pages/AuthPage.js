import React, { useState } from 'react';
import Login from '../features/auth/Login';
import SignUp from '../features/auth/SignUp';

export default function AuthPage() {
    const [isLoginView, setIsLoginView] = useState(true);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4">
            <div className="flex items-center gap-3 mb-6">
                <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 0L32 16L16 32L0 16L16 0Z" fill="#4F46E5" />
                    <path d="M16 6L26 16L16 26L6 16L16 6Z" fill="white" />
                </svg>
                <h1 className="text-4xl font-bold text-gray-900">Pulse</h1>
            </div>
            <p className="text-gray-600 mb-8">Your automated competitive intelligence platform.</p>
            
            <div className="w-full max-w-md">
                {isLoginView ? <Login /> : <SignUp />}
            </div>

            <p className="mt-6 text-center text-sm text-gray-600">
                {isLoginView ? "Don't have an account?" : "Already have an account?"}
                <button 
                    onClick={() => setIsLoginView(!isLoginView)} 
                    className="font-medium text-primary hover:text-indigo-500 ml-1"
                >
                    {isLoginView ? 'Sign up' : 'Sign in'}
                </button>
            </p>
        </div>
    );
}
