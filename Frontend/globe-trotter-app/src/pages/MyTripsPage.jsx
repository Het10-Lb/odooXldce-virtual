import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import TripCard from '../components/dashboard/TripCard';
import { fetchUserTrips } from '../services/api';

export default function MyTripsPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadTrips() {
      try {
        setIsLoading(true);
        const data = await fetchUserTrips();
        if (isMounted && data) {
          const rawTrips = data.trips || (Array.isArray(data) ? data : []);
          setTrips(rawTrips);
        }
      } catch (err) {
        console.warn('Error loading trips from database:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadTrips();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredTrips = trips.filter((t) => {
    if (activeTab === 'ALL') return true;
    return t.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface relative pb-24">
      <Header />

      <main className="pt-20 px-margin-mobile max-w-max-width mx-auto flex flex-col gap-6">
        <div className="flex justify-between items-center mt-2">
          <div>
            <h2 className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface">My Trips</h2>
            <p className="font-body-md text-on-surface-variant text-sm">
              Your journeys fetched directly from database
            </p>
          </div>

          <button
            onClick={() => navigate('/create-trip')}
            className="px-4 py-2.5 bg-electric-sky text-on-primary font-label-md rounded-xl shadow hover:bg-primary transition-all flex items-center gap-1.5 cursor-pointer text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create Trip
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 bg-surface-container p-1 rounded-2xl overflow-x-auto hide-scrollbar">
          {['ALL', 'UPCOMING', 'ONGOING', 'COMPLETED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-label-md transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab === 'ALL' ? 'All Trips' : tab}
            </button>
          ))}
        </div>

        {/* Trips List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="p-12 text-center bg-surface-container rounded-3xl flex flex-col items-center gap-3 border border-outline-variant/10">
            <span className="material-symbols-outlined text-5xl text-outline-variant">flight_takeoff</span>
            <p className="font-headline-md text-on-surface text-base">No trips found in this category.</p>
            <button
              onClick={() => navigate('/create-trip')}
              className="mt-2 px-5 py-3 bg-electric-sky text-on-primary font-label-md rounded-xl shadow hover:bg-primary transition-all text-sm cursor-pointer"
            >
              Plan a New Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
