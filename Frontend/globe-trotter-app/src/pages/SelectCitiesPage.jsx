import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import CityGroupSection from '../components/select-cities/CityGroupSection';
import { fetchTopRegionalDestinations } from '../services/api';

export default function SelectCitiesPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialTripInfo = location.state?.tripInfo || null;

  const [cityGroups, setCityGroups] = useState([]);
  const [allCitiesList, setAllCitiesList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCityIds, setSelectedCityIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadBackendCities() {
      try {
        setIsLoading(true);
        const data = await fetchTopRegionalDestinations({ limit: 50 });
        if (isMounted && data?.destinations) {
          const rawCities = data.destinations.map((c) => ({
            id: c.id,
            name: c.name,
            state: c.state || 'Popular',
            country: c.country,
            region: c.region,
            image: c.bannerImageUrl || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
            description: c.description,
          }));
          setAllCitiesList(rawCities);

          // Group by state
          const groupedMap = rawCities.reduce((acc, city) => {
            const groupKey = city.state || 'Popular';
            if (!acc[groupKey]) {
              acc[groupKey] = [];
            }
            acc[groupKey].push(city);
            return acc;
          }, {});

          const groups = Object.keys(groupedMap).map((stateKey) => ({
            state: stateKey,
            layout: 'grid',
            cities: groupedMap[stateKey],
          }));

          setCityGroups(groups);

          // Select first city by default if none selected
          if (rawCities.length > 0) {
            setSelectedCityIds([rawCities[0].id]);
          }
        }
      } catch (err) {
        console.error('Failed to load cities from database:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadBackendCities();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleCity = (cityId) => {
    setSelectedCityIds((prev) =>
      prev.includes(cityId) ? prev.filter((id) => id !== cityId) : [...prev, cityId]
    );
  };

  // Filter groups & cities by search query
  const filteredGroups = cityGroups
    .map((group) => {
      const matchesState = group.state.toLowerCase().includes(searchQuery.toLowerCase());
      const matchingCities = group.cities.filter(
        (c) => matchesState || c.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return {
        ...group,
        cities: matchingCities,
      };
    })
    .filter((group) => group.cities.length > 0);

  const selectedCities = allCitiesList.filter((c) => selectedCityIds.includes(c.id));

  const handleContinue = () => {
    navigate('/select-activities', { state: { selectedCities, tripInfo: initialTripInfo } });
  };

  return (
    <div className="min-h-screen bg-surface font-body-md relative">
      <Header />

      <main className="relative w-full pt-20 pb-36 bg-surface min-h-screen">
        <div className="flex flex-col w-full gap-gutter px-margin-mobile max-w-max-width mx-auto">
          {/* Header Section */}
          <div className="flex flex-col gap-base mt-2">
            <h2 className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface">
              Select your destination cities
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Choose the places you want to explore from database.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input
              type="text"
              placeholder="Search a state or a city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container h-12 rounded-xl pl-12 pr-4 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition-all placeholder:text-outline"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          {/* City Selection Groups */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group) => (
                  <CityGroupSection
                    key={group.state}
                    group={group}
                    selectedCityIds={selectedCityIds}
                    onToggleCity={handleToggleCity}
                  />
                ))
              ) : (
                <div className="p-8 text-center bg-surface-container rounded-2xl">
                  <p className="font-body-md text-on-surface-variant">No cities found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-surface/90 backdrop-blur-md z-40 border-t border-outline-variant/20 shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
        <div className="max-w-max-width mx-auto">
          <button
            type="button"
            onClick={handleContinue}
            disabled={selectedCityIds.length === 0}
            className={`w-full h-14 font-label-md text-label-md rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer ${
              selectedCityIds.length > 0
                ? 'bg-electric-sky text-on-primary hover:bg-primary'
                : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed opacity-60'
            }`}
          >
            Continue to Activities
            {selectedCityIds.length > 0 && (
              <span className="bg-white/20 text-on-primary px-2 py-0.5 rounded-full text-xs ml-1">
                {selectedCityIds.length}
              </span>
            )}
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
