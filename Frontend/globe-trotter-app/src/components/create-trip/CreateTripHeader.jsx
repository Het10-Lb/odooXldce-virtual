import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateTripHeader() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
      <div className="h-16 px-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container-high transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline-md text-headline-md text-on-surface truncate">Create Trip</h1>
      </div>
    </header>
  );
}
