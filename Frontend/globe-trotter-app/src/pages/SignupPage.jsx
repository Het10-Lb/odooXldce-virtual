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
    password: '',
    phoneNumber: '',
    city: '',
    country: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in required fields (First Name, Last Name, Email & Password).');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await signup(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md relative flex flex-col justify-center py-12 px-margin-mobile">
      {/* Top Bar Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
        <div className="h-16 px-4 flex items-center gap-3 max-w-max-width mx-auto">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline-md text-headline-md text-on-surface">Create Account</h1>
        </div>
      </header>

      {/* Registration Card Container */}
      <div className="w-full max-w-[560px] mx-auto bg-surface-container rounded-3xl p-8 shadow-md border border-outline-variant/20 mt-12 flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2 shadow-inner">
            <span className="material-symbols-outlined text-3xl">person_add</span>
          </div>
          <h2 className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface">
            Join GlobeTrotter ✈️
          </h2>
          <p className="font-body-md text-on-surface-variant text-sm">
            Create an account to start planning your journeys
          </p>
        </div>

        {error && (
          <div className="p-3 bg-error/10 text-error rounded-xl text-xs font-label-sm text-center">
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
                required
                placeholder="Alex"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-body-md p-3.5 rounded-xl outline-none focus:bg-surface-container-high focus:ring-2 focus:ring-primary placeholder:text-outline-variant transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-on-surface text-xs ml-1" htmlFor="last-name">
                Last Name <span className="text-error">*</span>
              </label>
              <input
                id="last-name"
                type="text"
                required
                placeholder="Morgan"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-body-md p-3.5 rounded-xl outline-none focus:bg-surface-container-high focus:ring-2 focus:ring-primary placeholder:text-outline-variant transition-all"
              />
            </div>
          </div>

          {/* 2-Column Grid Fields: Email Address & Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-on-surface text-xs ml-1" htmlFor="email-address">
                Email Address <span className="text-error">*</span>
              </label>
              <input
                id="email-address"
                type="email"
                required
                placeholder="alex@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-body-md p-3.5 rounded-xl outline-none focus:bg-surface-container-high focus:ring-2 focus:ring-primary placeholder:text-outline-variant transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-on-surface text-xs ml-1" htmlFor="password">
                Password <span className="text-error">*</span>
              </label>
              <input
                id="password"
                type="password"
                required
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-body-md p-3.5 rounded-xl outline-none focus:bg-surface-container-high focus:ring-2 focus:ring-primary placeholder:text-outline-variant transition-all"
              />
            </div>
          </div>

          {/* 2-Column Grid Fields: Phone Number & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-on-surface text-xs ml-1" htmlFor="phone-number">
                Phone Number
              </label>
              <input
                id="phone-number"
                type="tel"
                placeholder="+91 9876543210"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-body-md p-3.5 rounded-xl outline-none focus:bg-surface-container-high focus:ring-2 focus:ring-primary placeholder:text-outline-variant transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-on-surface text-xs ml-1" htmlFor="user-city">
                City
              </label>
              <input
                id="user-city"
                type="text"
                placeholder="e.g. Ahmedabad"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-body-md p-3.5 rounded-xl outline-none focus:bg-surface-container-high focus:ring-2 focus:ring-primary placeholder:text-outline-variant transition-all"
              />
            </div>
          </div>

          {/* Country Field */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-on-surface text-xs ml-1" htmlFor="user-country">
              Country
            </label>
            <input
              id="user-country"
              type="text"
              placeholder="e.g. India"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full bg-surface-container-low text-on-surface font-body-md p-3.5 rounded-xl outline-none focus:bg-surface-container-high focus:ring-2 focus:ring-primary placeholder:text-outline-variant transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full py-4 bg-electric-sky text-on-primary font-label-md rounded-xl shadow-md hover:bg-primary transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? 'Creating Account...' : 'Register'}
            {!isLoading && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
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
