import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import CityGroupSection from '../components/select-cities/CityGroupSection';

const MOCK_GROUPS = [
  {
    state: 'Goa',
    layout: 'grid',
    cities: [
      {
        id: 'dudhsagar',
        name: 'Dudhsagar',
        state: 'Goa',
        image: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'north-goa',
        name: 'North Goa',
        state: 'Goa',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'panjim',
        name: 'Panjim',
        state: 'Goa',
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'south-goa',
        name: 'South Goa',
        state: 'Goa',
        image: 'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  {
    state: 'Gujarat',
    layout: 'scroll',
    cities: [
      {
        id: 'ahmedabad',
        name: 'Ahmedabad',
        state: 'Gujarat',
        image: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'daman',
        name: 'Daman',
        state: 'Gujarat',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'diu',
        name: 'Diu',
        state: 'Gujarat',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'statue-of-unity',
        name: 'Statue of Unity',
        state: 'Gujarat',
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  {
    state: 'Maharashtra',
    layout: 'grid',
    cities: [
      {
        id: 'mumbai',
        name: 'Mumbai',
        state: 'Maharashtra',
        image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'lonavla',
        name: 'Lonavla',
        state: 'Maharashtra',
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'ajanta-ellora',
        name: 'Ajanta-Ellora',
        state: 'Maharashtra',
        image: 'https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'mahabaleshwar',
        name: 'Mahabaleshwar',
        state: 'Maharashtra',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
];

export default function SelectCitiesPage() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCityIds, setSelectedCityIds] = useState(['north-goa', 'ahmedabad']);

  const handleToggleCity = (cityId) => {
    setSelectedCityIds((prev) =>
      prev.includes(cityId) ? prev.filter((id) => id !== cityId) : [...prev, cityId]
    );
  };

  // Filter groups & cities by search query
  const filteredGroups = MOCK_GROUPS.map((group) => {
    const matchesState = group.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchingCities = group.cities.filter(
      (c) => matchesState || c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return {
      ...group,
      cities: matchingCities,
    };
  }).filter((group) => group.cities.length > 0);

  // Get selected city objects
  const allCities = MOCK_GROUPS.flatMap((g) => g.cities);
  const selectedCities = allCities.filter((c) => selectedCityIds.includes(c.id));

  const handleContinue = () => {
    navigate('/select-activities', { state: { selectedCities } });
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
              Choose the places you want to explore.
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
