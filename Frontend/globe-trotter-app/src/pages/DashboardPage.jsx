import React from 'react';
import { Link } from 'react-router-dom';
import HeroCTA from '../components/dashboard/HeroCTA';
import TripCard from '../components/dashboard/TripCard';
import InspirationCard from '../components/dashboard/InspirationCard';

const MOCK_TRIPS = [
  {
    id: 'tuscany-2026',
    title: 'Summer in Tuscany',
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
    duration: '14 Days',
    temp: '28°C',
    weatherIcon: 'wb_sunny',
    dateRange: 'Sep 12 - Sep 26',
    cityCount: 4,
    status: 'On Budget',
  },
  {
    id: 'alpine-2026',
    title: 'Alpine Retreat',
    image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80',
    duration: '7 Days',
    temp: '-2°C',
    weatherIcon: 'ac_unit',
    dateRange: 'Dec 15 - Dec 22',
    cityCount: 2,
    status: 'Planning',
  },
];

const MOCK_INSPIRATIONS = [
  {
    id: 'santorini',
    name: 'Santorini, Greece',
    description: 'Iconic sunsets, whitewashed houses, and volcanic beaches await.',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    tags: ['Coastal', 'Relaxing'],
  },
  {
    id: 'amalfi',
    name: 'Amalfi Coast, Italy',
    description: 'Dramatic coastlines, pastel fishing villages, and authentic cuisine.',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    tags: ['Scenic', 'Food'],
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <HeroCTA userName="Alex" />

      {/* Recent Trips Section */}
      <section className="py-6 flex flex-col gap-4">
        <div className="px-margin-mobile flex justify-between items-baseline">
          <h3 className="font-headline-md text-headline-md text-on-surface">Your Upcoming Trips</h3>
          <Link to="/my-trips" className="font-label-md text-label-md text-primary hover:underline">
            See all
          </Link>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto snap-x snap-mandatory px-margin-mobile gap-4 pb-4 hide-scrollbar">
          {MOCK_TRIPS.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
          <div className="snap-start shrink-0 w-4"></div>
        </div>
      </section>

      {/* Inspiration Section */}
      <section className="px-margin-mobile py-8 flex flex-col gap-6 bg-surface-container-low rounded-t-[32px] mt-4 min-h-[300px]">
        <div className="flex flex-col gap-1">
          <h3 className="font-headline-md text-headline-md text-on-surface">Recommended for You</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Based on your love for coastal views.</p>
        </div>
        <div className="flex flex-col gap-4">
          {MOCK_INSPIRATIONS.map((item) => (
            <InspirationCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
