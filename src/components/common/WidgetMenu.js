/* ========================================================================== */
/* FILE: src/components/common/WidgetMenu.js (NEW FILE)                       */
/* A reusable dropdown menu for the widget's three-dot icon.                  */
/* ========================================================================== */
import React from 'react';
import { RefreshCw, Download } from 'lucide-react';

export default function WidgetMenu({ onClose }) {
    return (
        <div className="absolute top-8 right-0 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
            <div className="p-2">
                <button className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">
                    <RefreshCw size={14} />
                    <span>Refresh Data</span>
                </button>
                 <button className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">
                    <Download size={14} />
                    <span>Export Data</span>
                </button>
            </div>
        </div>
    );
}