import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteTripFromDB } from '../../services/api';

export default function TripCard({ trip, onDeleteSuccess }) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const title = trip.name || trip.title || 'Untitled Trip';
  const image =
    trip.coverPhotoUrl ||
    trip.image ||
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80';

  const startFormatted = trip.startDate
    ? new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'Upcoming';
  const endFormatted = trip.endDate
    ? new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '';

  const dateRange = trip.dateRange || (endFormatted ? `${startFormatted} - ${endFormatted}` : startFormatted);
  const duration = trip.duration || (trip.durationDays ? `${trip.durationDays} Days` : '3 Days');
  const cityCount = trip.cityCount ?? trip.stopsCount ?? (trip.sections?.length || 1);
  const status = trip.status || 'Planning';

  const handleDeleteTrip = async (e) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      setIsDeleting(true);
      await deleteTripFromDB(trip.id);
      if (onDeleteSuccess) {
        onDeleteSuccess(trip.id);
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.warn('Failed to delete trip:', err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      onClick={() => navigate(`/builder/${trip.id}`)}
      className="snap-start shrink-0 w-[85vw] max-w-[320px] bg-surface-container rounded-2xl shadow-sm overflow-hidden flex flex-col group cursor-pointer hover:shadow-md transition-all active:scale-[0.98] relative"
    >
      <div className="relative w-full h-40">
        <img className="absolute inset-0 w-full h-full object-cover" src={image} alt={title} />
        
        {/* Delete Trip Button */}
        <button
          type="button"
          onClick={handleDeleteTrip}
          disabled={isDeleting}
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-surface/90 backdrop-blur-sm text-error hover:bg-error hover:text-on-error flex items-center justify-center transition-colors shadow-sm cursor-pointer"
          title="Delete Trip"
        >
          <span className="material-symbols-outlined text-[16px]">
            {isDeleting ? 'sync' : 'delete'}
          </span>
        </button>

        <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-sm px-3 py-1 rounded-lg font-label-sm text-on-surface shadow-sm flex items-center gap-1 text-xs">
          <span className="material-symbols-outlined text-[14px] text-primary">schedule</span>
          {duration}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div>
          <h4 className="font-headline-md text-headline-md text-on-surface text-xl mb-1 truncate">{title}</h4>
          <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">calendar_month</span>
            {dateRange}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-md font-label-sm text-xs flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined text-[14px]">location_city</span>
            {cityCount} {cityCount === 1 ? 'City' : 'Cities'}
          </span>
          <span
            className={`px-2.5 py-1 rounded-md font-label-sm text-xs flex items-center gap-1 font-bold ${
              status === 'COMPLETED'
                ? 'bg-tertiary/10 text-tertiary'
                : 'bg-primary/10 text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {status === 'COMPLETED' ? 'task_alt' : 'pending'}
            </span>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}
