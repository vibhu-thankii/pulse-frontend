/* ========================================================================== */
/* FILE: src/components/dashboard/FilterModal.js (NEW FILE)                   */
/* A placeholder modal for future filter options.                             */
/* ========================================================================== */
import React from 'react';
import { X } from 'lucide-react';
import Card from '../common/Card';

export default function FilterModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <Card className="w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>
                <div className="py-8 text-center">
                    <p className="text-gray-600">Advanced filtering options will be available here soon.</p>
                </div>
            </Card>
        </div>
    );
}