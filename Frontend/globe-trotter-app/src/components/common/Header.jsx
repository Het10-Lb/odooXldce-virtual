import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
      <div className="h-16 px-margin-mobile flex items-center justify-between">
        <Link to="/dashboard">
          <h1 className="font-headline-md text-headline-md text-primary tracking-tight">Globe Trotter</h1>
        </Link>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer">
          <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
        </div>
      </div>
    </header>
  );
}
