import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email/username and password.');
      return;
    }

    login({ email });
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
          <h1 className="font-headline-md text-headline-md text-on-surface">Log In</h1>
        </div>
      </header>

      {/* Login Card Container matching Screen 1 wireframe */}
      <div className="w-full max-w-[420px] mx-auto bg-surface-container rounded-3xl p-8 shadow-md border border-outline-variant/20 mt-12 flex flex-col gap-6">
        {/* Title Header */}
        <div className="flex flex-col gap-2 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2 shadow-inner">
            <span className="material-symbols-outlined text-3xl">flight_takeoff</span>
          </div>
          <h2 className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface">
            Welcome Back 👋
          </h2>
          <p className="font-body-md text-on-surface-variant text-sm">
            Log in to manage your trips and itineraries
          </p>
        </div>

        {error && (
          <div className="p-3 bg-error-container/40 text-on-error-container rounded-xl text-xs font-label-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Username / Email Input */}
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-on-surface text-sm ml-1" htmlFor="login-username">
              Username or Email
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                mail
              </span>
              <input
                id="login-username"
                type="text"
                placeholder="e.g. alex.morgan@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="w-full bg-surface-container-low text-on-surface font-body-md py-3.5 pl-12 pr-4 rounded-xl outline-none focus:bg-surface-container-high focus:ring-2 focus:ring-primary placeholder:text-outline-variant transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-on-surface text-sm ml-1" htmlFor="login-password">
              Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                lock
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full bg-surface-container-low text-on-surface font-body-md py-3.5 pl-12 pr-12 rounded-xl outline-none focus:bg-surface-container-high focus:ring-2 focus:ring-primary placeholder:text-outline-variant transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="mt-2 w-full py-4 bg-electric-sky text-on-primary font-label-md rounded-xl shadow-md hover:bg-primary transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            Login Button
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </form>

        {/* Footer Link to Signup */}
        <div className="text-center pt-2">
          <p className="font-body-sm text-on-surface-variant text-xs">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-label-md font-semibold hover:underline ml-1">
              Register Users
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
