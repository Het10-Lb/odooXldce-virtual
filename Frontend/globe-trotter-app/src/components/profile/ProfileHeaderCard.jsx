import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ProfileHeaderCard() {
  const { user, signup } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || 'Alex',
    lastName: user?.lastName || 'Morgan',
    email: user?.email || 'alex.morgan@example.com',
    phone: user?.phone || '+1 234 567 8900',
    city: user?.city || 'Paris',
    country: user?.country || 'France',
    bio: user?.bio || 'Passionate globetrotter & travel blogger exploring hidden gems around the world.',
    photo: user?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, photo: objectUrl }));
    }
  };

  const handleSave = () => {
    signup(formData);
    setIsEditing(false);
  };

  return (
    <div className="bg-surface-container rounded-3xl p-6 shadow-md border border-outline-variant/20 flex flex-col md:flex-row gap-6 items-start">
      {/* Left: Image of the User Circle */}
      <div className="flex flex-col items-center gap-2 self-center md:self-start shrink-0">
        <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-surface shadow-md group">
          <img
            src={formData.photo}
            alt={`${formData.firstName} ${formData.lastName}`}
            className="w-full h-full object-cover"
          />
          {isEditing && (
            <label className="absolute inset-0 bg-ocean-deep/60 flex flex-col items-center justify-center text-on-primary cursor-pointer transition-opacity">
              <span className="material-symbols-outlined text-2xl">photo_camera</span>
              <span className="font-label-sm text-[10px] uppercase font-bold">Change</span>
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
          )}
        </div>
      </div>

      {/* Right: User Details Box with Edit Option */}
      <div className="flex-1 flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
          <div>
            <h2 className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface">
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="font-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
              {formData.city}, {formData.country}
            </p>
          </div>

          <button
            type="button"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className={`px-4 py-2 rounded-xl font-label-md text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
              isEditing
                ? 'bg-electric-sky text-on-primary hover:bg-primary'
                : 'bg-surface-container-high text-on-surface hover:bg-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isEditing ? 'check' : 'edit'}
            </span>
            {isEditing ? 'Save Details' : 'Edit Profile'}
          </button>
        </div>

        {/* Display / Editable Form Fields */}
        {isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface-variant">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="bg-surface-container-low text-on-surface p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface-variant">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="bg-surface-container-low text-on-surface p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface-variant">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-surface-container-low text-on-surface p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface-variant">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="bg-surface-container-low text-on-surface p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface-variant">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="bg-surface-container-low text-on-surface p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface-variant">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="bg-surface-container-low text-on-surface p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div className="sm:col-span-2 flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface-variant">Bio / Additional Info</label>
              <textarea
                rows={2}
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="bg-surface-container-low text-on-surface p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 text-sm text-on-surface-variant">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">mail</span>
                <span>{formData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">call</span>
                <span>{formData.phone}</span>
              </div>
            </div>
            {formData.bio && (
              <p className="font-body-sm text-on-surface bg-surface-container-low p-3 rounded-xl">
                "{formData.bio}"
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
