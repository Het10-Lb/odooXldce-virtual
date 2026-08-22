import React from 'react';

export default function ActivityCard({ activity, isSelected, onToggle }) {
  return (
    <div
      onClick={() => onToggle(activity.id)}
      className="relative w-full h-48 rounded-[24px] overflow-hidden shadow-md group cursor-pointer active:scale-[0.99] transition-transform"
    >
      {/* Background Image & Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
        style={{ backgroundImage: `url('${activity.image}')` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/90 via-ocean-deep/20 to-transparent"></div>

      {/* Top Right Toggle Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(activity.id);
        }}
        className={`absolute top-4 right-4 w-8 h-8 rounded-full backdrop-blur flex items-center justify-center transition-colors cursor-pointer ${
          isSelected
            ? 'bg-primary text-on-primary'
            : 'bg-surface-container-lowest/80 text-on-surface hover:bg-surface-container-lowest'
        }`}
        aria-label={isSelected ? 'Remove activity' : 'Add activity'}
      >
        <span className="material-symbols-outlined text-[20px]">
          {isSelected ? 'check' : 'add'}
        </span>
      </button>

      {/* Card Details */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
        <div className="flex flex-col items-start gap-1">
          <span className="px-2 py-1 bg-surface-container-lowest/20 backdrop-blur rounded text-on-primary font-label-sm text-[10px] uppercase tracking-wider">
            {activity.category}
          </span>
          <h4 className="font-headline-md text-[20px] leading-tight text-on-primary drop-shadow-sm">
            {activity.title}
          </h4>
          <div className="flex items-center gap-2 text-primary-fixed font-body-sm text-body-sm">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span>{activity.duration}</span>
            <span className="w-1 h-1 rounded-full bg-primary-fixed"></span>
            <span className="material-symbols-outlined text-[16px]">star</span>
            <span>
              {activity.rating} ({activity.reviewsCount})
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="block font-headline-md text-headline-md text-on-primary">
            ₹{activity.price.toLocaleString()}
          </span>
          <span className="font-label-sm text-label-sm text-primary-fixed">per person</span>
        </div>
      </div>
    </div>
  );
}
