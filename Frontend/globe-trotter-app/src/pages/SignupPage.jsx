import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    photo: '',
    bio: '',
  });

  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewPhoto(objectUrl);
      setFormData((prev) => ({ ...prev, photo: objectUrl }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.email.trim()) {
      setError('Please fill in required fields (First Name & Email).');
      return;
    }

    signup(formData);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md relative flex flex-col justify-center py-12 px-margin-mobile">
      {/* Top Bar Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
        <div className="h-16 px-4 flex items-center gap-3 max-w-max-width mx-auto">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline-md text-headline-md text-on-surface">Registration</h1>
        </div>
      </header>

      {/* Registration Card Container matching Screen 2 wireframe */}
      <div className="w-full max-w-[560px] mx-auto bg-surface-container rounded-3xl p-8 shadow-md border border-outline-variant/20 mt-12 flex flex-col gap-6">
        {/* Photo Upload Circle at Top */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-24 h-24 rounded-full bg-surface-container-highest flex flex-col items-center justify-center border-2 border-dashed border-primary/40 overflow-hidden group cursor-pointer hover:border-primary transition-all">
            {previewPhoto ? (
              <img src={previewPhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-primary">
                <span className="material-symbols-outlined text-2xl">add_a_photo</span>
                <span className="font-label-sm text-[10px] uppercase font-bold mt-1">Photo</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <span className="font-label-sm text-xs text-on-surface-variant">Tap circle to add profile photo</span>
        </div>

        {error && (
          <div className="p-3 bg-error-container/40 text-on-error-container rounded-xl text-xs font-label-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 2-Column Grid Fields: First Name & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-on-surface text-xs ml-1" htmlFor="first-name">
                First Name <span className="text-error">*</span>
              </label>
              <input
                id="first-name"
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-body-md p-3.5 rounded-xl outline-none focus:bg-surface-container-high focus:ring-2 focus:ring-primary placeholder:text-outline-variant transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-on-surface text-xs ml-1" htmlFor="last-name">
                Last Name
              </label>
              <input
                id="last-name"
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-body-md p-3.5 rounded-xl outline-none focus:bg-surface-container-high focus:ring-2 focus:ring-primary placeholder:text-outline-variant transition-all"
              />
            </div>
          </div>

          {/* 2-Column Grid Fields: Email Address & Phone Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-on-surface text-xs ml-1" htmlFor="email-address">
                Email Address <span className="text-error">*</span>
              </label>
              <input
                id="email-address"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-body-md p-3.5 rounded-xl outline-none focus:bg-surface-container-high focus:ring-2 focus:ring-primary placeholder:text-outline-variant transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-on-surface text-xs ml-1" htmlFor="phone-number">
                Phone Number
              </label>
              <input
                id="phone-number"
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-body-md p-3.5 rounded-xl outline-none focus:bg-surface-container-high focus:ring-2 focus:ring-primary placeholder:text-outline-variant transition-all"
              />
            </div>
          </div>

          {/* 2-Column Grid Fields: City & Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-on-surface text-xs ml-1" htmlFor="user-city">
                City
              </label>
              <input
                id="user-city"
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-body-md p-3.5 rounded-xl outline-none focus:bg-surface-container-high focus:ring-2 focus:ring-primary placeholder:text-outline-variant transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-on-surface text-xs ml-1" htmlFor="user-country">
                Country
              </label>
              <input
                id="user-country"
                type="text"
                placeholder="Country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-body-md p-3.5 rounded-xl outline-none focus:bg-surface-container-high focus:ring-2 focus:ring-primary placeholder:text-outline-variant transition-all"
              />
            </div>
          </div>

          {/* Additional Information Textarea */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-on-surface text-xs ml-1" htmlFor="additional-info">
              Additional Information....
            </label>
            <textarea
              id="additional-info"
              rows={3}
              placeholder="Tell us about your travel style, preferences, or bio..."
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="w-full bg-surface-container-low text-on-surface font-body-md p-3.5 rounded-xl outline-none focus:bg-surface-container-high focus:ring-2 focus:ring-primary placeholder:text-outline-variant resize-none transition-all"
            />
          </div>

          {/* Register Users Button */}
          <button
            type="submit"
            className="mt-2 w-full py-4 bg-electric-sky text-on-primary font-label-md rounded-xl shadow-md hover:bg-primary transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            Register Users
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </form>

        {/* Footer Link to Login */}
        <div className="text-center pt-1">
          <p className="font-body-sm text-on-surface-variant text-xs">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-label-md font-semibold hover:underline ml-1">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
