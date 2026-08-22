import React from 'react';

export default function CityCard({ city, isSelected, onToggle, layout = 'grid' }) {
  const isScrollLayout = layout === 'scroll';

  return (
    <button
      type="button"
      onClick={() => onToggle(city.id)}
      className={`group relative rounded-2xl overflow-hidden bg-surface-container shadow-sm border border-outline-variant/20 focus:outline-none transition-all text-left cursor-pointer ${
        isScrollLayout
          ? 'snap-start min-w-[160px] w-[160px] aspect-[4/5] shrink-0'
          : 'w-full aspect-square'
      } ${isSelected ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'}`}
    >
      <img
        src={city.image}
        alt={city.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/90 via-ocean-deep/30 to-transparent"></div>

      <div
        className={`absolute bottom-0 left-0 w-full p-3 flex ${
          isScrollLayout ? 'flex-col gap-2' : 'justify-between items-end'
        }`}
      >
        {!isScrollLayout && <span className="font-label-md text-label-md text-on-primary truncate">{city.name}</span>}

        <div
          className={`rounded-full border-2 flex items-center justify-center transition-all ${
            isScrollLayout ? 'w-5 h-5 self-end' : 'w-6 h-6'
          } ${
            isSelected
              ? 'border-primary bg-primary text-on-primary'
              : 'border-on-primary/50 group-hover:border-on-primary'
          }`}
        >
          <span
            className={`material-symbols-outlined text-on-primary transition-opacity ${
              isScrollLayout ? 'text-[12px]' : 'text-[14px]'
            } ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}
          >
            check
          </span>
        </div>

        {isScrollLayout && <span className="font-label-md text-label-md text-on-primary truncate">{city.name}</span>}
      </div>
    </button>
  );
}
