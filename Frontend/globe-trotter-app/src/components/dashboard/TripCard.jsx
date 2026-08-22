import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TripCard({ trip }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/builder/${trip.id}`)}
      className="snap-start shrink-0 w-[85vw] max-w-[320px] bg-surface-container rounded-2xl shadow-sm overflow-hidden flex flex-col group cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
    >
      <div className="relative w-full h-40">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src={trip.image}
          alt={trip.title}
        />
        <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-sm px-3 py-1 rounded-lg font-label-sm text-on-surface shadow-sm flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px] text-primary">schedule</span>
          {trip.duration}
        </div>
        <div className="absolute top-3 left-3 bg-surface/90 backdrop-blur-sm px-3 py-1 rounded-lg font-label-sm text-on-surface shadow-sm flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px] text-primary">{trip.weatherIcon || 'wb_sunny'}</span>
          {trip.temp}
        </div>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div>
          <h4 className="font-headline-md text-headline-md text-on-surface text-xl mb-1 truncate">{trip.title}</h4>
          <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">calendar_month</span>
            {trip.dateRange}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="bg-primary-container/30 text-primary-container-on px-2 py-1 rounded-md font-label-sm text-xs flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">location_city</span>
            {trip.cityCount} Cities
          </span>
          <span
            className={`px-2 py-1 rounded-md font-label-sm text-xs flex items-center gap-1 ${
              trip.status === 'On Budget'
                ? 'bg-tertiary-container/20 text-tertiary-container-on'
                : 'bg-secondary-container/30 text-on-secondary-container'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {trip.status === 'On Budget' ? 'wallet' : 'pending'}
            </span>
            {trip.status}
          </span>
        </div>
      </div>
    </div>
  );
}
