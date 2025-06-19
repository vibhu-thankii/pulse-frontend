import React from 'react';

export default function Button({ children, fullWidth = false, disabled = false, ...props }) {
    const widthClass = fullWidth ? 'w-full' : '';
    return (
        <button
            {...props}
            disabled={disabled}
            className={`flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-indigo-400 disabled:cursor-not-allowed ${widthClass}`}
        >
            {children}
        </button>
    );
}