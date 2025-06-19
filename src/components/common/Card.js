import React from 'react';

export default function Card({ children, className = '', padding = 'p-6' }) {
    return (
        <div className={`bg-white rounded-lg shadow-sm ${padding} ${className}`}>
            {children}
        </div>
    );
}