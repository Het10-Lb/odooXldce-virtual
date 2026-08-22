import React from 'react';
import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 w-full z-50 bg-surface/80 backdrop-blur-xl pb-safe border-t border-outline-variant/20 shadow-[0_-1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex justify-around items-center h-16 max-w-max-width mx-auto px-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 min-w-[56px] ${
              isActive ? 'text-primary font-bold' : 'text-on-surface-variant'
            }`
          }
        >
          <span className="material-symbols-outlined text-[22px]">home</span>
          <span className="font-label-sm text-[11px]">Home</span>
        </NavLink>

        <NavLink
          to="/community"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 min-w-[56px] ${
              isActive ? 'text-primary font-bold' : 'text-on-surface-variant'
            }`
          }
        >
          <span className="material-symbols-outlined text-[22px]">groups</span>
          <span className="font-label-sm text-[11px]">Community</span>
        </NavLink>

        <NavLink
          to="/create-trip"
          className="flex flex-col items-center justify-center -mt-4 text-on-surface-variant min-w-[56px]"
        >
          <div className="bg-electric-sky text-on-primary w-12 h-12 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
            <span className="material-symbols-outlined text-[26px]">add</span>
          </div>
        </NavLink>

        <NavLink
          to="/my-trips"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 min-w-[56px] ${
              isActive ? 'text-primary font-bold' : 'text-on-surface-variant'
            }`
          }
        >
          <span className="material-symbols-outlined text-[22px]">map</span>
          <span className="font-label-sm text-[11px]">My Trips</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 min-w-[56px] ${
              isActive ? 'text-primary font-bold' : 'text-on-surface-variant'
            }`
          }
        >
          <span className="material-symbols-outlined text-[22px]">person</span>
          <span className="font-label-sm text-[11px]">Profile</span>
        </NavLink>
      </div>
    </nav>
  );
}
