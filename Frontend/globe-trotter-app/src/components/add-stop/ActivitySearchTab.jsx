import React, { useState } from 'react';

const MOCK_ACTIVITIES = [
  {
    id: 'eiffel-summit',
    title: 'Eiffel Tower Summit Access',
    duration: '3h',
    rating: 4.8,
    price: '€28',
    image:
      'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'louvre-guided',
    title: 'Louvre Museum Guided Tour',
    duration: '2.5h',
    rating: 4.9,
    price: '€45',
    image:
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'ballooning-jaipur',
    title: 'Hot Air Ballooning',
    duration: '3h',
    rating: 4.9,
    price: '₹8,500',
    image:
      'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=400&q=80',
  },
];

export default function ActivitySearchTab({ selectedActivities, onToggleActivity }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredActivities = MOCK_ACTIVITIES.filter((act) =>
    act.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-1 px-margin-mobile">
      {/* Search Input */}
      <div className="mb-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input
            type="text"
            placeholder="What's the plan? Search for an activity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-low text-on-surface font-body-lg py-4 pl-12 pr-12 rounded-xl shadow-[0_2px_12px_rgba(0,34,72,0.06)] focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface transition-all placeholder:text-outline-variant"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">cancel</span>
            </button>
          )}
        </div>
      </div>

      {/* Activity Results List */}
      <div className="flex-1 overflow-y-auto">
        <div className="text-label-sm text-on-surface-variant mb-2 px-2 uppercase tracking-wider">
          Top Activities near Paris
        </div>
        <div className="bg-surface-container-low rounded-xl shadow-sm overflow-hidden flex flex-col gap-2 p-2">
          {filteredActivities.map((act) => {
            const isAdded = selectedActivities.some((item) => item.id === act.id);
            return (
              <div
                key={act.id}
                onClick={() => onToggleActivity(act)}
                className={`w-full flex items-start gap-4 p-3 rounded-lg hover:shadow-md transition-all text-left relative group cursor-pointer border ${
                  isAdded ? 'bg-primary/5 border-primary' : 'bg-surface border-transparent'
                }`}
              >
                <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-surface-container shadow-sm">
                  <img src={act.image} alt={act.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 py-1 flex flex-col h-full justify-between gap-1">
                  <div>
                    <h3 className="font-headline-md text-[16px] text-on-surface truncate leading-tight mb-1">
                      {act.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-on-surface-variant font-body-sm text-xs">
                      <span className="material-symbols-outlined text-[14px]">schedule</span> {act.duration}
                      <span className="mx-1 opacity-50">•</span>
                      <span className="material-symbols-outlined text-[14px]">star</span> {act.rating}
                    </div>
                  </div>
                  <div className="font-label-md text-primary font-bold">{act.price} / person</div>
                </div>

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all ${
                    isAdded ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isAdded ? 'check' : 'add'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
