import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateTripHeader from '../components/create-trip/CreateTripHeader';
import CoverPhotoUploader from '../components/create-trip/CoverPhotoUploader';

export default function CreateTripPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    coverPhoto: null,
    coverPhotoUrl: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Trip name is required.';
    }

    if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
      newErrors.endDate = 'End date cannot be earlier than start date.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save trip data (can integrate Redux or API service here)
    const createdTrip = {
      id: `trip-${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
    };

    console.log('Trip Created Successfully:', createdTrip);

    // Navigate to Select Cities page as instructed
    navigate('/select-cities', { state: { trip: createdTrip } });
  };

  return (
    <div className="min-h-screen bg-surface font-body-md relative">
      <CreateTripHeader />

      <main className="relative w-full pt-20 pb-32 bg-surface min-h-screen">
        <div className="px-margin-mobile flex flex-col gap-8 w-full max-w-max-width mx-auto">
          {/* Header Section */}
          <div className="flex flex-col gap-2">
            <h2 className="font-headline-xl-mobile text-on-surface">Plan your adventure</h2>
            <p className="font-body-md text-on-surface-variant">
              Let's start by giving your trip a name and some basic details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
            {/* Trip Name Input */}
            <div className="flex flex-col gap-2 relative group">
              <label className="font-label-md text-on-surface ml-1" htmlFor="trip-name">
                Trip Name <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  flight_takeoff
                </span>
                <input
                  id="trip-name"
                  type="text"
                  placeholder="e.g., My Dream Escape"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full bg-surface-container-low text-on-surface font-body-md py-4 pl-12 pr-4 rounded-xl outline-none transition-all focus:bg-surface-container-high focus:ring-2 focus:ring-primary placeholder:text-outline-variant ${
                    errors.name ? 'border-2 border-error' : ''
                  }`}
                />
              </div>
              {errors.name && <span className="text-xs text-error ml-1">{errors.name}</span>}
            </div>

            {/* Date Selection (Side by Side) */}
            <div className="flex gap-4 w-full">
              {/* Start Date */}
              <div className="flex flex-col gap-2 w-1/2 relative group">
                <label className="font-label-md text-on-surface ml-1" htmlFor="start-date">
                  Start Date
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                    calendar_month
                  </span>
                  <input
                    id="start-date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface font-body-md py-4 pl-10 pr-3 rounded-xl outline-none transition-all focus:bg-surface-container-high focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* End Date */}
              <div className="flex flex-col gap-2 w-1/2 relative group">
                <label className="font-label-md text-on-surface ml-1" htmlFor="end-date">
                  End Date
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                    event
                  </span>
                  <input
                    id="end-date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className={`w-full bg-surface-container-low text-on-surface font-body-md py-4 pl-10 pr-3 rounded-xl outline-none transition-all focus:bg-surface-container-high focus:ring-2 focus:ring-primary appearance-none cursor-pointer ${
                      errors.endDate ? 'border-2 border-error' : ''
                    }`}
                  />
                </div>
              </div>
            </div>
            {errors.endDate && <span className="text-xs text-error ml-1">{errors.endDate}</span>}

            {/* Cover Photo Upload */}
            <CoverPhotoUploader
              value={formData.coverPhotoUrl}
              onChange={(file, url) => {
                setFormData((prev) => ({ ...prev, coverPhoto: file, coverPhotoUrl: url }));
              }}
            />

            {/* Trip Description */}
            <div className="flex flex-col gap-2 relative group">
              <label className="font-label-md text-on-surface ml-1" htmlFor="trip-desc">
                Description (Optional)
              </label>
              <textarea
                id="trip-desc"
                rows={4}
                placeholder="What are you looking forward to? Who is coming?"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-body-md p-4 rounded-xl outline-none transition-all focus:bg-surface-container-high focus:ring-2 focus:ring-primary placeholder:text-outline-variant resize-none"
              />
            </div>
          </form>
        </div>
      </main>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-surface/80 backdrop-blur-2xl pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.04)] z-40">
        <div className="p-4 w-full max-w-max-width mx-auto flex gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-4 px-6 rounded-xl font-label-md text-primary bg-transparent border-2 border-primary hover:bg-primary/5 transition-all active:scale-[0.98] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-[2] py-4 px-6 rounded-xl font-label-md text-on-primary bg-electric-sky flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary transition-all active:scale-[0.98] cursor-pointer"
          >
            Save & Continue
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
