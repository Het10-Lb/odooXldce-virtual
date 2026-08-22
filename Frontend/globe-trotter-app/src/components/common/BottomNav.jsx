import React from 'react';
import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 w-full z-50 bg-surface/80 backdrop-blur-xl pb-safe shadow-[0_-1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex justify-around items-center h-16">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 min-w-[64px] ${
              isActive ? 'text-primary font-bold' : 'text-on-surface-variant'
            }`
          }
        >
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-sm text-label-sm">Home</span>
        </NavLink>

        <NavLink
          to="/create-trip"
          className="flex flex-col items-center gap-1 text-on-surface-variant min-w-[64px]"
        >
          <div className="bg-primary-container text-on-primary-container w-12 h-10 rounded-xl flex items-center justify-center hover:scale-105 transition-transform shadow-md">
            <span className="material-symbols-outlined">add</span>
          </div>
        </NavLink>

        <NavLink
          to="/my-trips"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 min-w-[64px] ${
              isActive ? 'text-primary font-bold' : 'text-on-surface-variant'
            }`
          }
        >
          <span className="material-symbols-outlined">map</span>
          <span className="font-label-sm text-label-sm">My Trips</span>
        </NavLink>
      </div>
    </nav>
  );
}
