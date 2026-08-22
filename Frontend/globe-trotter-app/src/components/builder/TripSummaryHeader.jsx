import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TripSummaryHeader({ trip, onAddStop }) {
  const navigate = useNavigate();

  const handleAddClick = () => {
    if (onAddStop) {
      onAddStop();
    } else {
      navigate('/add-stop?tab=city');
    }
  };

  return (
    <div className="px-margin-mobile py-6 bg-surface-container-highest">
      {/* Title & Duration Pill */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-headline-xl-mobile text-on-surface">{trip?.title || 'France Trip'}</h2>
        <span className="px-3 py-1 bg-primary/10 text-primary font-label-md rounded-full">
          {trip?.duration || '12 Days'}
        </span>
      </div>
      <p className="font-body-md text-on-surface-variant mb-4">
        {trip?.route || 'Paris → Lyon → Nice'}
      </p>

      {/* City Stops Carousel */}
      <div className="flex gap-2 overflow-x-auto snap-x hide-scrollbar pb-2">
        {trip?.cities?.map((city, idx) => (
          <div
            key={city.id || idx}
            className="snap-start flex-none relative h-20 w-32 rounded-xl overflow-hidden shadow-sm flex items-end p-2 bg-ocean-deep/90 text-on-primary group cursor-pointer"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay group-hover:scale-105 transition-transform duration-300"
              style={{ backgroundImage: `url('${city.image}')` }}
            ></div>
            <span className="relative z-10 font-label-md truncate">{city.name}</span>
          </div>
        ))}

        {/* + Add City Stop Button Card (Redirects to /add-stop?tab=city) */}
        <button
          type="button"
          onClick={handleAddClick}
          className="snap-start flex-none h-20 w-20 rounded-xl bg-surface border-2 border-dashed border-primary/40 shadow-sm flex flex-col items-center justify-center text-primary gap-1 hover:bg-primary/5 hover:border-primary transition-all active:scale-95 cursor-pointer"
          title="Add City Stop"
        >
          <span className="material-symbols-outlined text-[24px]">add</span>
          <span className="font-label-sm">Add</span>
        </button>
      </div>
    </div>
  );
}
