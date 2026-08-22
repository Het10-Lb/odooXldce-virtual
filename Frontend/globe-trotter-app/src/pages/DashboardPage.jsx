import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroCTA from '../components/dashboard/HeroCTA';
import TripCard from '../components/dashboard/TripCard';
import InspirationCard from '../components/dashboard/InspirationCard';
import { fetchTopRegionalDestinations, fetchUserTrips } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [userTrips, setUserTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        setError(null);

        const [recData, tripsData] = await Promise.allSettled([
          fetchTopRegionalDestinations({ limit: 5 }),
          fetchUserTrips(),
        ]);

        if (isMounted) {
          if (recData.status === 'fulfilled' && recData.value?.destinations) {
            const formatted = recData.value.destinations.slice(0, 5).map((dest) => ({
              id: dest.id,
              name: dest.country ? `${dest.name}, ${dest.country}` : dest.name,
              description:
                dest.description ||
                `Top rated regional destination in ${dest.region || dest.state || 'India'} with high popularity.`,
              image: dest.bannerImageUrl,
              tags: [dest.region, dest.state].filter(Boolean),
              region: dest.region,
              state: dest.state,
              country: dest.country,
            }));
            setRecommendations(formatted);
          }

          if (tripsData.status === 'fulfilled' && tripsData.value) {
            const rawTrips = tripsData.value.trips || (Array.isArray(tripsData.value) ? tripsData.value : []);
            setUserTrips(rawTrips);
          }
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data from database:', err);
        if (isMounted) {
          setError('Unable to load dashboard data from database.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <HeroCTA userName={user?.firstName || 'Traveler'} />

      {/* User Trips Section */}
      <section className="py-6 flex flex-col gap-4">
        <div className="px-margin-mobile flex justify-between items-baseline">
          <h3 className="font-headline-md text-headline-md text-on-surface">Your Trips</h3>
          <Link to="/my-trips" className="font-label-md text-label-md text-primary hover:underline">
            See all
          </Link>
        </div>

        {userTrips.length === 0 ? (
          <div className="mx-margin-mobile p-6 bg-surface-container rounded-2xl text-center flex flex-col items-center gap-2">
            <p className="font-body-sm text-on-surface-variant">No upcoming trips created yet.</p>
            <Link
              to="/create-trip"
              className="mt-1 px-4 py-2 bg-electric-sky text-on-primary font-label-md text-xs rounded-xl shadow hover:bg-primary transition-all"
            >
              Create Trip
            </Link>
          </div>
        ) : (
          <div className="flex overflow-x-auto snap-x snap-mandatory px-margin-mobile gap-4 pb-4 hide-scrollbar">
            {userTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
            <div className="snap-start shrink-0 w-4"></div>
          </div>
        )}
      </section>

      {/* Inspiration Section */}
      <section className="px-margin-mobile py-8 flex flex-col gap-6 bg-surface-container-low rounded-t-[32px] mt-4 min-h-[300px]">
        <div className="flex flex-col gap-1">
          <h3 className="font-headline-md text-headline-md text-on-surface">Recommended for You</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Featured top regional destinations from database.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-error bg-error/10 rounded-xl text-sm">
              {error}
            </div>
          ) : recommendations.length === 0 ? (
            <div className="p-4 text-center text-on-surface-variant text-sm">
              No regional recommendations found in database.
            </div>
          ) : (
            recommendations.map((item) => <InspirationCard key={item.id} item={item} />)
          )}
        </div>
      </section>
    </div>
  );
}
