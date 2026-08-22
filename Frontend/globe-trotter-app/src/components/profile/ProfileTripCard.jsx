import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfileTripCard({ trip }) {
  const navigate = useNavigate();

  return (
    <div className="flex-none w-64 bg-surface rounded-2xl overflow-hidden shadow-sm border border-outline-variant/20 flex flex-col group hover:shadow-md transition-all">
      {/* Cover Photo */}
      <div className="h-36 w-full relative overflow-hidden bg-ocean-deep">
        <img
          src={trip.image}
          alt={trip.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 px-2.5 py-1 bg-ocean-deep/80 backdrop-blur rounded-full text-on-primary font-label-sm text-[10px]">
          {trip.duration}
        </div>
      </div>

      {/* Details & View Button matching Screen 7 */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3 bg-surface-container-low">
        <div>
          <h4 className="font-headline-md text-base text-on-surface line-clamp-1 mb-1">
            {trip.title}
          </h4>
          <p className="font-body-sm text-xs text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            {trip.dates}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/itinerary-builder')}
          className="w-full py-2 bg-surface-container-high hover:bg-electric-sky hover:text-on-primary text-on-surface font-label-md text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1"
        >
          View
          <span className="material-symbols-outlined text-[14px]">visibility</span>
        </button>
      </div>
    </div>
  );
}
