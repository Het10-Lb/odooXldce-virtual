import React, { useState } from 'react';

const MOCK_CITIES = [
  { id: 'paris', name: 'Paris', region: 'Île-de-France, France' },
  { id: 'nice', name: 'Nice', region: "Provence-Alpes-Côte d'Azur, France" },
  { id: 'lyon', name: 'Lyon', region: 'Auvergne-Rhône-Alpes, France' },
  { id: 'tokyo', name: 'Tokyo', region: 'Kanto, Japan' },
  { id: 'rome', name: 'Rome', region: 'Lazio, Italy' },
];

export default function CitySearchTab({ selectedCity, onSelectCity }) {
  const [searchQuery, setSearchQuery] = useState('Paris');

  const filteredCities = MOCK_CITIES.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-1 px-margin-mobile">
      {/* Search Input */}
      <div className="mb-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input
            type="text"
            placeholder="Where to next? Search for a city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-low text-on-surface font-body-lg py-4 pl-12 pr-12 rounded-xl shadow-[0_2px_12px_rgba(0,34,72,0.06)] focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface transition-all placeholder:text-outline-variant"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">cancel</span>
            </button>
          )}
        </div>
      </div>

      {/* City Results List */}
      <div className="flex-1 overflow-y-auto">
        <div className="text-label-sm text-on-surface-variant mb-2 px-2 uppercase tracking-wider">
          Search Results
        </div>
        <div className="bg-surface-container-low rounded-xl shadow-sm overflow-hidden flex flex-col">
          {filteredCities.map((city) => {
            const isSelected = selectedCity?.id === city.id;
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => onSelectCity(city)}
                className={`w-full flex items-center gap-4 p-4 transition-colors text-left relative group cursor-pointer border-b border-surface-container-high/50 last:border-b-0 ${
                  isSelected ? 'bg-primary/5' : 'hover:bg-surface-container'
                }`}
              >
                {isSelected && <div className="absolute inset-y-0 left-0 w-1 bg-primary rounded-r"></div>}
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-inner ${
                    isSelected
                      ? 'bg-surface-container-high text-primary'
                      : 'bg-surface-container-lowest text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    location_city
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-headline-md text-[18px] text-on-surface truncate leading-tight">
                    {city.name}
                  </h3>
                  <p className="font-body-sm text-on-surface-variant truncate">{city.region}</p>
                </div>
                {isSelected && (
                  <div className="text-primary">
                    <span className="material-symbols-outlined">check_circle</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Expanded Arrival / Departure Form */}
        {selectedCity && (
          <div className="mt-6 animate-fade-in">
            <h3 className="font-headline-md text-[20px] text-on-surface mb-4 px-1">
              When are you visiting {selectedCity.name}?
            </h3>
            <div className="bg-surface-container-low p-4 rounded-xl shadow-sm flex flex-col gap-4">
              <div className="flex gap-4 items-center">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="font-label-sm text-on-surface-variant uppercase tracking-wider pl-1">
                    Arrival
                  </label>
                  <div className="w-full flex items-center gap-3 p-3 bg-surface rounded-lg shadow-inner">
                    <span className="material-symbols-outlined text-primary text-[20px]">calendar_month</span>
                    <input
                      type="date"
                      defaultValue="2026-10-12"
                      className="bg-transparent font-body-md text-on-surface outline-none w-full cursor-pointer"
                    />
                  </div>
                </div>
                <div className="w-8 flex items-center justify-center pt-6 text-outline-variant">
                  <span className="material-symbols-outlined text-[20px]">arrow_right_alt</span>
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="font-label-sm text-on-surface-variant uppercase tracking-wider pl-1">
                    Departure
                  </label>
                  <div className="w-full flex items-center gap-3 p-3 bg-surface rounded-lg shadow-inner">
                    <span className="material-symbols-outlined text-outline text-[20px]">calendar_month</span>
                    <input
                      type="date"
                      defaultValue="2026-10-16"
                      className="bg-transparent font-body-md text-on-surface outline-none w-full cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-tertiary-container/10 rounded-lg mt-1">
                <span className="material-symbols-outlined text-tertiary text-[20px]">info</span>
                <p className="font-body-sm text-on-surface-variant text-xs">
                  Trip overall dates: Oct 10 - Oct 25.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
