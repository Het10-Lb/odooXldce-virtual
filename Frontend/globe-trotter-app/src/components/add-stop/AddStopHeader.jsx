import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddStopHeader({ activeTab, onTabChange }) {
  const navigate = useNavigate();

  return (
    <div className="px-margin-mobile pt-4 pb-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Add to Trip</h2>
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Close"
          className="w-10 h-10 flex items-center justify-center text-on-surface-variant bg-surface-container rounded-full shadow-sm hover:bg-surface-container-high transition-colors active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </div>

      {/* Segmented Tab Selector */}
      <div className="flex bg-surface-container p-1 rounded-xl shadow-sm mb-6 relative">
        <div
          className={`w-1/2 absolute top-1 bottom-1 bg-surface rounded-lg shadow-sm transition-transform duration-300 ease-in-out ${
            activeTab === 'activity' ? 'translate-x-full left-[-4px]' : 'left-1'
          }`}
        ></div>
        <button
          type="button"
          onClick={() => onTabChange('city')}
          className={`w-1/2 py-2.5 font-label-md relative z-10 transition-colors cursor-pointer ${
            activeTab === 'city' ? 'text-on-surface font-bold' : 'text-on-surface-variant'
          }`}
        >
          Add City
        </button>
        <button
          type="button"
          onClick={() => onTabChange('activity')}
          className={`w-1/2 py-2.5 font-label-md relative z-10 transition-colors cursor-pointer ${
            activeTab === 'activity' ? 'text-on-surface font-bold' : 'text-on-surface-variant'
          }`}
        >
          Add Activity
        </button>
      </div>
    </div>
  );
}
