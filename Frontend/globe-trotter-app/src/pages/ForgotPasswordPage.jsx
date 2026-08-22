import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { requestForgotPassword } from '../services/api';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [devDebug, setDevDebug] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setMessage('');
      const response = await requestForgotPassword(email);
      setMessage(response.message || 'If an account exists, a reset link has been sent.');
      if (response.devDebug) {
        setDevDebug(response.devDebug);
      }
    } catch (err) {
      setError(err.message || 'Failed to request password reset.');
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
          <h1 className="font-headline-md text-headline-md text-on-surface">Forgot Password</h1>
        </div>
      </header>

      {/* Forgot Password Card */}
      <div className="w-full max-w-[420px] mx-auto bg-surface-container rounded-3xl p-8 shadow-md border border-outline-variant/20 mt-12 flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2 shadow-inner">
            <span className="material-symbols-outlined text-3xl">lock_reset</span>
          </div>
          <h2 className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface">
            Reset Password
          </h2>
          <p className="font-body-md text-on-surface-variant text-sm">
            Enter your registered email address to receive reset instructions
          </p>
        </div>

        {error && (
          <div className="p-3 bg-error/10 text-error rounded-xl text-xs font-label-sm text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3 bg-primary/10 text-primary rounded-xl text-xs font-label-sm text-center">
            {message}
          </div>
        )}

        {devDebug && (
          <div className="p-3 bg-surface-container-high border border-primary/20 rounded-xl text-xs text-on-surface flex flex-col gap-1 break-all">
            <span className="font-bold text-primary">Dev Testing Link:</span>
            <a href={devDebug.resetUrl} className="text-primary underline">
              {devDebug.resetUrl}
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-on-surface text-sm ml-1" htmlFor="reset-email">
              Email Address
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                mail
              </span>
              <input
                id="reset-email"
                type="email"
                required
                placeholder="e.g. alex.morgan@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-body-md py-3.5 pl-12 pr-4 rounded-xl outline-none focus:bg-surface-container-high focus:ring-2 focus:ring-primary placeholder:text-outline-variant transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full py-4 bg-electric-sky text-on-primary font-label-md rounded-xl shadow-md hover:bg-primary transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
            {!isLoading && <span className="material-symbols-outlined text-[20px]">send</span>}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="font-body-sm text-on-surface-variant text-xs">
            Remembered your password?{' '}
            <Link to="/login" className="text-primary font-label-md font-semibold hover:underline ml-1">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
