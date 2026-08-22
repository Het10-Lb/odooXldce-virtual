import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/common/Header';
import { fetchUserTrips } from '../services/api';
import TripCard from '../components/dashboard/TripCard';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [trips, setTrips] = useState([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadUserTrips() {
      try {
        setIsLoadingTrips(true);
        const data = await fetchUserTrips();
        if (isMounted && data) {
          const rawTrips = data.trips || (Array.isArray(data) ? data : []);
          setTrips(rawTrips);
        }
      } catch (err) {
        console.warn('Error loading profile trips:', err.message);
      } finally {
        if (isMounted) setIsLoadingTrips(false);
      }
    }
    loadUserTrips();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface relative pb-24">
      <Header />

      <main className="pt-20 px-margin-mobile max-w-max-width mx-auto flex flex-col gap-6">
        {/* User Info Header Card */}
        <div className="bg-surface-container rounded-3xl p-6 shadow-sm border border-outline-variant/20 flex flex-col sm:flex-row items-center gap-6 mt-4">
          <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold border-2 border-primary/20 shrink-0 overflow-hidden">
            {user?.photoUrl ? (
              <img src={user.photoUrl} alt="Profile" className="w-full h-full object-cover rounded-full" />
            ) : (
              `${user?.firstName?.[0] || 'U'}${user?.lastName?.[0] || ''}`
            )}
          </div>

          <div className="flex flex-col items-center sm:items-start flex-1 gap-1 text-center sm:text-left">
            <h2 className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="font-body-sm text-on-surface-variant text-sm">{user?.email}</p>
            {(user?.city || user?.country) && (
              <p className="font-label-sm text-xs text-primary bg-primary/10 px-3 py-1 rounded-full mt-1">
                📍 {[user.city, user.country].filter(Boolean).join(', ')}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="px-5 py-2.5 bg-error/10 text-error hover:bg-error hover:text-on-error rounded-xl font-label-md transition-all cursor-pointer flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Logout
          </button>
        </div>

        {/* Trips Section */}
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex justify-between items-center">
            <h3 className="font-headline-md text-headline-md text-on-surface">Your Trips ({trips.length})</h3>
            <button
              onClick={() => navigate('/create-trip')}
              className="text-xs font-label-md text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Create Trip
            </button>
          </div>

          {isLoadingTrips ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : trips.length === 0 ? (
            <div className="p-8 text-center bg-surface-container rounded-2xl flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-4xl text-outline-variant">connecting_airports</span>
              <p className="font-body-md text-on-surface-variant">You haven't created any trips yet.</p>
              <button
                onClick={() => navigate('/create-trip')}
                className="px-4 py-2 bg-electric-sky text-on-primary font-label-md rounded-xl shadow hover:bg-primary transition-all cursor-pointer"
              >
                Create Your First Trip
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
