import React from 'react';
import CityCard from './CityCard';

export default function CityGroupSection({ group, selectedCityIds, onToggleCity }) {
  const isScroll = group.layout === 'scroll';

  return (
    <section className="flex flex-col gap-4">
      {/* Group Header */}
      <div className="flex items-center gap-2 bg-surface-container-high py-2 px-4 rounded-lg">
        <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
        <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">{group.state}</h3>
      </div>

      {/* Cards Container */}
      {isScroll ? (
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-margin-mobile px-margin-mobile hide-scrollbar">
          {group.cities.map((city) => (
            <CityCard
              key={city.id}
              city={city}
              isSelected={selectedCityIds.includes(city.id)}
              onToggle={onToggleCity}
              layout="scroll"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {group.cities.map((city) => (
            <CityCard
              key={city.id}
              city={city}
              isSelected={selectedCityIds.includes(city.id)}
              onToggle={onToggleCity}
              layout="grid"
            />
          ))}
        </div>
      )}
    </section>
  );
}
