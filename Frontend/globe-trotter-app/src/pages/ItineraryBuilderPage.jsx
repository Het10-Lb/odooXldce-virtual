import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import TripSummaryHeader from '../components/builder/TripSummaryHeader';
import TimelineThread from '../components/builder/TimelineThread';
import TripCalendarView from '../components/builder/TripCalendarView';

const MOCK_TRIP = {
  id: 'france-trip',
  title: 'France Trip',
  duration: '12 Days',
  route: 'Paris → Lyon → Nice',
  cities: [
    {
      id: 'paris',
      name: 'Paris',
      image:
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'lyon',
      name: 'Lyon',
      image:
        'https://images.unsplash.com/photo-1524168272322-bf73616d9cb5?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'nice',
      name: 'Nice',
      image:
        'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80',
    },
  ],
};

const MOCK_DAYS = [
  {
    id: 'day-1',
    dayNumber: 1,
    title: 'Arrival & Exploration',
    date: 'Thursday, Oct 12',
    activities: [
      {
        id: 'act-1',
        category: 'CHECK-IN',
        time: '2:00 PM',
        title: 'Le Marais Boutique Hotel',
        description: 'Drop off bags and freshen up.',
        isBooked: true,
      },
      {
        id: 'act-2',
        category: 'Culture',
        time: '4:00 PM',
        duration: '2h',
        title: 'Louvre Twilight Tour',
        description: 'Guided evening tour to avoid the crowds.',
        price: '€45/pp',
        distance: '15m walk',
        isBooked: false,
      },
    ],
  },
  {
    id: 'day-2',
    dayNumber: 2,
    title: 'Iconic Landmarks',
    date: 'Friday, Oct 13',
    activities: [
      {
        id: 'act-3',
        category: 'Sightseeing',
        time: '9:00 AM',
        duration: '3h',
        title: 'Eiffel Tower Summit',
        description: 'Early access skip-the-line tickets to the top.',
        price: '€28/pp',
        isBooked: true,
        image:
          'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
];

export default function ItineraryBuilderPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' | 'calendar'

  const handleAddCityStop = () => {
    navigate('/add-stop?tab=city');
  };

  const handleAddActivity = () => {
    navigate('/add-stop?tab=activity');
  };

  return (
    <div className="min-h-screen bg-surface font-body-md relative">
      <Header />

      <main className="relative w-full pt-16 pb-24 bg-surface min-h-screen">
        <div className="flex flex-col w-full max-w-max-width mx-auto">
          {/* Trip Summary Header & City Stops Carousel */}
          <TripSummaryHeader trip={MOCK_TRIP} onAddStop={handleAddCityStop} />

          {/* View Switcher Controls (Timeline View vs. Calendar View) */}
          <div className="px-margin-mobile pt-4 pb-2 flex justify-between items-center bg-surface border-b border-outline-variant/10">
            <h3 className="font-headline-md text-on-surface text-lg font-bold">
              {viewMode === 'timeline' ? 'Schedule Timeline' : 'Trip Calendar Grid'}
            </h3>
            <div className="flex bg-surface-container p-1 rounded-xl shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1.5 font-label-md text-xs rounded-lg transition-all cursor-pointer ${
                  viewMode === 'timeline'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Timeline
              </button>
              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 font-label-md text-xs rounded-lg transition-all cursor-pointer ${
                  viewMode === 'calendar'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Calendar View
              </button>
            </div>
          </div>

          {/* Render Timeline View OR Calendar View */}
          {viewMode === 'timeline' ? (
            <TimelineThread days={MOCK_DAYS} onAddActivity={handleAddActivity} />
          ) : (
            <TripCalendarView trip={MOCK_TRIP} />
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-safe right-4 mb-4 z-40">
        <button
          type="button"
          onClick={() => setViewMode(viewMode === 'timeline' ? 'calendar' : 'timeline')}
          className="h-14 px-6 bg-electric-sky text-on-primary rounded-full shadow-lg hover:shadow-xl hover:bg-primary transition-all active:scale-95 flex items-center gap-2 font-label-md cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">
            {viewMode === 'timeline' ? 'calendar_month' : 'format_list_bulleted'}
          </span>
          {viewMode === 'timeline' ? 'Calendar View' : 'Timeline View'}
        </button>
      </div>
    </div>
  );
}
