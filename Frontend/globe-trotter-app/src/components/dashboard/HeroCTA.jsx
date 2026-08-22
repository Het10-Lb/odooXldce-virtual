import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function HeroCTA() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  const greetingName = isLoggedIn && user?.firstName ? user.firstName : 'Traveler';

  return (
    <section className="relative px-margin-mobile pt-8 pb-6 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-tertiary-fixed-dim/10 rounded-full blur-2xl -z-10 -translate-x-1/3 translate-y-1/3"></div>

      <div className="flex flex-col gap-2 mb-8">
        <h2 className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface">
          Hello, {greetingName}! <span className="text-3xl">👋</span>
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Ready for your next adventure?</p>
      </div>

      {/* Main CTA Card */}
      <div className="relative bg-gradient-to-br from-primary to-ocean-deep rounded-2xl p-6 shadow-xl overflow-hidden group active:scale-[0.98] transition-transform duration-300">
        <div className="absolute inset-0 bg-white/5 opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10 flex flex-col items-start gap-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              flight_takeoff
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-headline-lg text-headline-lg text-on-primary">Plan New Trip</h3>
            <p className="font-body-sm text-body-sm text-on-primary/80">
              Start building your next itinerary from scratch or get inspired.
            </p>
          </div>
          <button
            onClick={() => navigate('/create-trip')}
            className="mt-2 bg-on-primary text-primary px-6 py-3 rounded-xl font-label-md flex items-center gap-2 shadow-sm hover:shadow-md transition-all w-full justify-center active:scale-95 cursor-pointer"
          >
            Let's go <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </section>
  );
}
