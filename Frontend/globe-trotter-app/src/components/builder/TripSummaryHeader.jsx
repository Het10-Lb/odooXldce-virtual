import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TripSummaryHeader({ trip, onAddStop, onDeleteCity }) {
  const navigate = useNavigate();

  const handleAddClick = () => {
    if (onAddStop) {
      onAddStop();
    } else {
      navigate('/select-cities');
    }
  };

  return (
    <div className="px-margin-mobile py-6 bg-surface-container-highest border-b border-outline-variant/10">
      {/* Title & Duration Pill */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-headline-xl-mobile text-on-surface font-bold text-2xl">{trip?.title || 'India Trip'}</h2>
        <span className="px-3 py-1 bg-primary/10 text-primary font-label-md rounded-full text-xs font-bold">
          {trip?.duration || '3 Days'}
        </span>
      </div>
      <p className="font-body-md text-on-surface-variant mb-4 text-sm">
        {trip?.route || 'Route'}
      </p>

      {/* City Stops Carousel */}
      <div className="flex gap-2 overflow-x-auto snap-x hide-scrollbar pb-2">
        {trip?.cities?.map((city, idx) => (
          <div
            key={city.id || idx}
            className="snap-start flex-none relative h-20 w-36 rounded-xl overflow-hidden shadow-sm flex items-end p-2 bg-ocean-deep/90 text-on-primary group"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay group-hover:scale-105 transition-transform duration-300"
              style={{ backgroundImage: `url('${city.image}')` }}
            ></div>
            
            {onDeleteCity && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteCity(city.id);
                }}
                className="absolute top-1.5 right-1.5 z-20 w-6 h-6 rounded-full bg-black/60 text-white hover:bg-error flex items-center justify-center transition-colors cursor-pointer"
                title={`Remove ${city.name}`}
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}

            <span className="relative z-10 font-label-md truncate text-xs font-bold">{city.name}</span>
          </div>
        ))}

        {/* + Add City Stop Button Card */}
        <button
          type="button"
          onClick={handleAddClick}
          className="snap-start flex-none h-20 w-20 rounded-xl bg-surface border-2 border-dashed border-primary/40 shadow-sm flex flex-col items-center justify-center text-primary gap-1 hover:bg-primary/5 hover:border-primary transition-all active:scale-95 cursor-pointer"
          title="Add City Stop"
        >
          <span className="material-symbols-outlined text-[24px]">add</span>
          <span className="font-label-sm text-xs font-bold">Add Stop</span>
        </button>
      </div>
    </div>
  );
}
