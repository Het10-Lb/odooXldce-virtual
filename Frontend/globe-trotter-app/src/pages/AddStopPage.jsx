import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AddStopHeader from '../components/add-stop/AddStopHeader';
import CitySearchTab from '../components/add-stop/CitySearchTab';
import ActivitySearchTab from '../components/add-stop/ActivitySearchTab';

export default function AddStopPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialTab = searchParams.get('tab') === 'activity' ? 'activity' : 'city';
  const [activeTab, setActiveTab] = useState(initialTab);

  const [selectedCity, setSelectedCity] = useState({
    id: 'paris',
    name: 'Paris',
    region: 'Île-de-France, France',
  });

  const [selectedActivities, setSelectedActivities] = useState([]);

  const handleToggleActivity = (activity) => {
    setSelectedActivities((prev) =>
      prev.some((a) => a.id === activity.id)
        ? prev.filter((a) => a.id !== activity.id)
        : [...prev, activity]
    );
  };

  const handleSaveToItinerary = () => {
    // Navigate back to Itinerary Builder with updated state
    navigate('/itinerary-builder', {
      state: {
        addedCity: activeTab === 'city' ? selectedCity : null,
        addedActivities: activeTab === 'activity' ? selectedActivities : null,
      },
    });
  };

  return (
    <div className="min-h-screen bg-surface font-body-md flex flex-col relative">
      <AddStopHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 flex flex-col pb-28 bg-surface">
        {activeTab === 'city' ? (
          <CitySearchTab selectedCity={selectedCity} onSelectCity={setSelectedCity} />
        ) : (
          <ActivitySearchTab
            selectedActivities={selectedActivities}
            onToggleActivity={handleToggleActivity}
          />
        )}
      </main>

      {/* Fixed Bottom Action CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface/90 backdrop-blur-md shadow-[0_-4px_16px_rgba(0,0,0,0.04)] z-40 border-t border-outline-variant/20">
        <div className="max-w-max-width mx-auto">
          <button
            type="button"
            onClick={handleSaveToItinerary}
            className="w-full bg-electric-sky text-on-primary font-label-md py-4 rounded-xl shadow-md hover:shadow-lg hover:bg-primary transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            {activeTab === 'city' ? 'Add City to Itinerary' : 'Add Activity to Itinerary'}
          </button>
        </div>
      </div>
    </div>
  );
}
