import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TimelineThread({ days, onAddActivity, onDeleteActivity }) {
  const navigate = useNavigate();

  const handleAddActivityClick = (dayId) => {
    if (onAddActivity) {
      onAddActivity(dayId);
    } else {
      navigate('/select-activities');
    }
  };

  return (
    <div className="flex-1 px-margin-mobile py-6 bg-surface">
      {days.map((day) => (
        <div key={day.id} className="mb-8">
          {/* Day Header Circle */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-md shadow-sm text-lg font-bold">
                {day.dayNumber}
              </div>
              <div>
                <h4 className="font-headline-md text-on-surface font-bold text-lg">{day.title}</h4>
                <p className="font-body-sm text-on-surface-variant text-xs">{day.date}</p>
              </div>
            </div>

            {day.dayTotalCost !== undefined && (
              <span className="font-label-md text-xs text-primary bg-primary/10 px-3 py-1 rounded-full font-bold">
                Day Cost: ₹{day.dayTotalCost.toLocaleString()}
              </span>
            )}
          </div>

          {/* Thread Line Container */}
          <div className="relative pl-6 ml-[23px] border-l-2 border-outline-variant/30 flex flex-col gap-4">
            {day.activities.map((act) => (
              <div
                key={act.id}
                className="relative bg-surface-container rounded-xl overflow-hidden shadow-sm flex flex-col p-4 border border-outline-variant/10"
              >
                {/* Thread Dot Indicator */}
                <div className="absolute -left-[31px] top-4 w-3 h-3 rounded-full bg-primary ring-4 ring-surface"></div>

                {/* Cover Image if present */}
                {act.image && (
                  <div className="h-36 w-full relative -mx-4 -mt-4 mb-3 overflow-hidden">
                    <img src={act.image} alt={act.title} className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Category Badge, Time & Delete Button */}
                <div className="flex justify-between items-start mb-2 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-primary bg-primary/10 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                      {act.category}
                    </span>
                    {act.cityName && (
                      <span className="font-label-sm text-on-surface-variant text-xs bg-surface-container-high px-2 py-0.5 rounded-full">
                        📍 {act.cityName}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-xs text-on-surface-variant">
                      {act.time} {act.duration && `(${act.duration})`}
                    </span>
                    {onDeleteActivity && (
                      <button
                        type="button"
                        onClick={() => onDeleteActivity(act.id, act.sectionId)}
                        className="text-error hover:bg-error/10 p-1 rounded-full transition-colors cursor-pointer"
                        title="Delete activity"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <h5 className="font-headline-md text-on-surface text-[18px] mb-1 font-bold">
                  {act.title}
                </h5>
                {act.description && (
                  <p className="font-body-sm text-on-surface-variant mb-3 text-sm">
                    {act.description}
                  </p>
                )}

                {/* Metadata Row */}
                <div className="flex items-center justify-between text-on-surface-variant font-label-sm pt-2 border-t border-outline-variant/10 text-xs">
                  {act.price && (
                    <span className="flex items-center gap-1 text-primary font-bold">
                      <span className="material-symbols-outlined text-[16px]">payments</span>
                      {act.price}
                    </span>
                  )}
                  {act.isBooked && (
                    <span className="flex items-center gap-1 text-tertiary font-bold">
                      <span className="material-symbols-outlined text-[16px]">task_alt</span>
                      Booked
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* + Add Activity Button inside Day Thread */}
            <button
              type="button"
              onClick={() => handleAddActivityClick(day.id)}
              className="relative mt-2 flex items-center gap-2 text-primary font-label-md py-2 group cursor-pointer text-xs"
            >
              <div className="absolute -left-[31px] w-3 h-3 rounded-full bg-surface border-2 border-dashed border-primary"></div>
              <span className="material-symbols-outlined text-[20px] bg-primary/10 rounded-full p-1 group-hover:bg-primary/20 transition-colors">
                add
              </span>
              Add Activity to Itinerary
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
