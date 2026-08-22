import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TimelineThread({ days, onAddActivity }) {
  const navigate = useNavigate();

  const handleAddActivityClick = (dayId) => {
    if (onAddActivity) {
      onAddActivity(dayId);
    } else {
      navigate('/add-stop?tab=activity');
    }
  };

  return (
    <div className="flex-1 px-margin-mobile py-6 bg-surface">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-headline-lg text-on-surface">Paris Itinerary</h3>
        <div className="flex items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined text-[20px]">calendar_today</span>
          <span className="font-label-md">Oct 12 - 16</span>
        </div>
      </div>

      {days.map((day) => (
        <div key={day.id} className="mb-8">
          {/* Day Header Circle */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-headline-md shadow-sm">
              {day.dayNumber}
            </div>
            <div>
              <h4 className="font-headline-md text-on-surface">{day.title}</h4>
              <p className="font-body-sm text-on-surface-variant">{day.date}</p>
            </div>
          </div>

          {/* Thread Line Container */}
          <div className="relative pl-6 ml-[23px] border-l-2 border-outline-variant/30 flex flex-col gap-4">
            {day.activities.map((act) => (
              <div
                key={act.id}
                className="relative bg-surface-container rounded-xl overflow-hidden shadow-sm flex flex-col p-4"
              >
                {/* Thread Dot Indicator */}
                <div
                  className={`absolute -left-[31px] top-4 w-3 h-3 rounded-full ${
                    act.isBooked
                      ? 'bg-primary ring-4 ring-surface'
                      : 'bg-surface ring-2 ring-primary'
                  }`}
                ></div>

                {/* Cover Image if present */}
                {act.image && (
                  <div className="h-32 w-full relative -mx-4 -mt-4 mb-3 overflow-hidden">
                    <img
                      src={act.image}
                      alt={act.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Category Badge & Time */}
                <div className="flex justify-between items-start mb-2">
                  <span className="font-label-sm text-tertiary-container bg-tertiary-fixed/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {act.category}
                  </span>
                  <span className="font-label-sm text-on-surface-variant">
                    {act.time} {act.duration && `(${act.duration})`}
                  </span>
                </div>

                {/* Title & Description */}
                <h5 className="font-headline-md text-on-surface text-[18px] mb-1">
                  {act.title}
                </h5>
                {act.description && (
                  <p className="font-body-sm text-on-surface-variant mb-3">
                    {act.description}
                  </p>
                )}

                {/* Metadata Row */}
                <div className="flex items-center gap-4 text-on-surface-variant font-label-sm">
                  {act.price && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">payments</span>
                      {act.price}
                    </span>
                  )}
                  {act.distance && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">directions_walk</span>
                      {act.distance}
                    </span>
                  )}
                  {act.isBooked && (
                    <span className="flex items-center gap-1 text-tertiary font-bold">
                      <span className="material-symbols-outlined text-[16px]">confirmation_number</span>
                      Booked
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* + Add Activity Button inside Day Thread (Redirects to /add-stop?tab=activity) */}
            <button
              type="button"
              onClick={() => handleAddActivityClick(day.id)}
              className="relative mt-2 flex items-center gap-2 text-primary font-label-md py-2 group cursor-pointer"
            >
              <div className="absolute -left-[31px] w-3 h-3 rounded-full bg-surface border-2 border-dashed border-primary"></div>
              <span className="material-symbols-outlined text-[20px] bg-primary/10 rounded-full p-1 group-hover:bg-primary/20 transition-colors">
                add
              </span>
              Add Activity
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
