import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ItineraryBuilderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedActivities = location.state?.selectedActivities || [];
  const totalPrice = location.state?.totalPrice || 0;

  return (
    <div className="min-h-screen bg-surface p-margin-mobile pt-20 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container-high"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="font-headline-xl-mobile text-on-surface">Itinerary Builder</h2>
      </div>

      <div className="bg-surface-container rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        <h3 className="font-headline-md text-on-surface text-xl">
          Your Itinerary Timeline
        </h3>
        <p className="font-body-md text-on-surface-variant">
          Selected Experiences ({selectedActivities.length}) • Total Est. ₹{totalPrice.toLocaleString()}
        </p>

        <div className="flex flex-col gap-3 mt-2">
          {selectedActivities.map((act) => (
            <div key={act.id} className="bg-surface p-4 rounded-xl flex justify-between items-center shadow-sm">
              <div>
                <h4 className="font-headline-md text-base text-on-surface">{act.title}</h4>
                <p className="font-body-sm text-xs text-on-surface-variant">{act.cityName} • {act.duration}</p>
              </div>
              <span className="font-label-md text-primary font-bold">₹{act.price.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
