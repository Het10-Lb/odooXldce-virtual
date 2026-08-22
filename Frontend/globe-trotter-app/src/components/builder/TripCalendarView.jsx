import React, { useState } from 'react';

const INITIAL_TRIP_EVENTS = [
  {
    id: 'paris-trip',
    title: 'PARIS TRIP',
    startDate: 11,
    endDate: 15,
    color: 'bg-surface-container-high text-on-surface border-l-4 border-primary',
  },
  {
    id: 'nyc-getaway',
    title: 'NYC GETAWAY',
    startDate: 15,
    endDate: 18,
    color: 'bg-primary text-on-primary',
  },
  {
    id: 'japan-adventure',
    title: 'JAPAN ADVENTURE',
    startDate: 16,
    endDate: 21,
    color: 'bg-ocean-deep text-on-primary',
  },
];

const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export default function TripCalendarView({ trip }) {
  const [currentMonth, setCurrentMonth] = useState('January 2026');
  const [events, setEvents] = useState(INITIAL_TRIP_EVENTS);
  const [draggedEventId, setDraggedEventId] = useState(null);

  // Month grid: 31 days starting on Thursday (offset 4)
  const totalDays = 31;
  const startOffset = 4; // Starts on Thursday

  const handleDragStart = (eventId) => {
    setDraggedEventId(eventId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetDay) => {
    if (!draggedEventId) return;

    setEvents((prevEvents) =>
      prevEvents.map((evt) => {
        if (evt.id === draggedEventId) {
          const duration = evt.endDate - evt.startDate;
          const newStart = targetDay;
          const newEnd = Math.min(31, newStart + duration);
          return { ...evt, startDate: newStart, endDate: newEnd };
        }
        return evt;
      })
    );

    setDraggedEventId(null);
  };

  return (
    <div className="px-margin-mobile py-6 bg-surface flex flex-col gap-6">
      {/* Month Navigation Header matching reference image */}
      <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-2xl shadow-sm">
        <button
          type="button"
          onClick={() => setCurrentMonth('December 2025')}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h3 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
          {currentMonth}
        </h3>
        <button
          type="button"
          onClick={() => setCurrentMonth('February 2026')}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-surface rounded-2xl p-4 shadow-sm border border-outline-variant/20 flex flex-col">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center font-label-sm text-on-surface-variant mb-3 font-bold uppercase tracking-wider text-xs">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid Cells (7 columns) */}
        <div className="grid grid-cols-7 gap-1 relative">
          {/* Empty offset cells */}
          {Array.from({ length: startOffset }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-20 bg-surface-container-low/30 rounded-lg"></div>
          ))}

          {/* Days 1 to 31 */}
          {Array.from({ length: totalDays }).map((_, idx) => {
            const dayNum = idx + 1;
            const activeEvents = events.filter(
              (evt) => dayNum >= evt.startDate && dayNum <= evt.endDate
            );

            return (
              <div
                key={`day-${dayNum}`}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(dayNum)}
                className={`h-20 rounded-lg p-1 flex flex-col justify-between border border-outline-variant/10 transition-colors relative ${
                  activeEvents.length > 0
                    ? 'bg-surface-container-low/80'
                    : 'bg-surface hover:bg-surface-container-low/40'
                }`}
              >
                <span className="font-label-sm text-xs font-semibold text-on-surface-variant self-end">
                  {dayNum}
                </span>

                {/* Render Event Span Pills inside cell */}
                <div className="flex flex-col gap-1 w-full overflow-hidden">
                  {activeEvents.map((evt) => {
                    const isStart = dayNum === evt.startDate;
                    return (
                      <div
                        key={evt.id}
                        draggable
                        onDragStart={() => handleDragStart(evt.id)}
                        className={`text-[10px] font-label-md px-1.5 py-1 rounded shadow-xs truncate cursor-grab active:cursor-grabbing hover:opacity-95 transition-all ${
                          evt.color
                        }`}
                        title={`${evt.title} (Drag to move)`}
                      >
                        {isStart ? evt.title : '•'}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-surface-container p-4 rounded-xl text-center">
        <p className="font-body-sm text-xs text-on-surface-variant">
          💡 <span className="font-semibold text-primary">Tip:</span> Drag and drop event pills across dates to adjust your travel schedule!
        </p>
      </div>
    </div>
  );
}
