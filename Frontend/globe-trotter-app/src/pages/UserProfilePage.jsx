import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import ProfileHeaderCard from '../components/profile/ProfileHeaderCard';
import ProfileTripCard from '../components/profile/ProfileTripCard';

const PREPLANNED_TRIPS = [
  {
    id: 'preplanned-1',
    title: 'France Riviera & Alps',
    dates: 'Oct 12 - Oct 24, 2026',
    duration: '12 Days',
    image:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'preplanned-2',
    title: 'Golden Triangle Rajasthan',
    dates: 'Nov 5 - Nov 15, 2026',
    duration: '10 Days',
    image:
      'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'preplanned-3',
    title: 'Tokyo & Kyoto Explorer',
    dates: 'Dec 1 - Dec 10, 2026',
    duration: '9 Days',
    image:
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80',
  },
];

const PREVIOUS_TRIPS = [
  {
    id: 'previous-1',
    title: 'Rome & Amalfi Coast',
    dates: 'May 10 - May 20, 2025',
    duration: '10 Days',
    image:
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'previous-2',
    title: 'Goa Beach Retreat',
    dates: 'Jan 15 - Jan 22, 2025',
    duration: '7 Days',
    image:
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'previous-3',
    title: 'Swiss Alps Expedition',
    dates: 'Aug 5 - Aug 15, 2024',
    duration: '10 Days',
    image:
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=400&q=80',
  },
];

export default function UserProfilePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md relative">
      <Header />

      <main className="relative w-full pt-20 pb-24 bg-surface min-h-screen">
        <div className="flex flex-col w-full max-w-max-width mx-auto px-margin-mobile gap-8">
          {/* Top Profile Header Card */}
          <ProfileHeaderCard />

          {/* Preplanned Trips Section matching Screen 7 */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-lg text-headline-lg text-on-surface">
                Preplanned Trips
              </h3>
              <button
                type="button"
                onClick={() => navigate('/create-trip')}
                className="font-label-md text-primary hover:underline text-xs flex items-center gap-1 cursor-pointer"
              >
                + Plan New
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto snap-x hide-scrollbar pb-2">
              {PREPLANNED_TRIPS.map((trip) => (
                <ProfileTripCard key={trip.id} trip={trip} />
              ))}
            </div>
          </section>

          {/* Previous Trips Section matching Screen 7 */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-lg text-headline-lg text-on-surface">
                Previous Trips
              </h3>
              <span className="font-label-sm text-xs text-on-surface-variant">3 completed</span>
            </div>

            <div className="flex gap-4 overflow-x-auto snap-x hide-scrollbar pb-2">
              {PREVIOUS_TRIPS.map((trip) => (
                <ProfileTripCard key={trip.id} trip={trip} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
