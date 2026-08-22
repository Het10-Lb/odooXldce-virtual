import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowMenu(false);
    navigate('/dashboard');
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
      <div className="h-16 px-margin-mobile flex items-center justify-between max-w-max-width mx-auto">
        {/* App Title Logo */}
        <Link to="/dashboard">
          <h1 className="font-headline-md text-headline-md text-primary tracking-tight">Globe Trotter</h1>
        </Link>

        {/* Auth Condition: Show Login Button IF Not Logged In, Else Show Profile Avatar */}
        {isLoggedIn ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden shadow-sm hover:scale-105 transition-transform cursor-pointer flex items-center justify-center bg-primary"
              aria-label="User menu"
            >
              {user?.photo ? (
                <img src={user.photo} alt={user.firstName || 'Profile'} className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-on-primary text-[20px]">person</span>
              )}
            </button>

            {/* Profile Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-surface-container rounded-2xl shadow-xl border border-outline-variant/20 p-2 flex flex-col gap-1 z-50 animate-fade-in">
                <div className="p-2 border-b border-outline-variant/20">
                  <p className="font-headline-md text-sm text-on-surface truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="font-body-sm text-xs text-on-surface-variant truncate">{user?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 p-2 rounded-xl text-error hover:bg-error-container/20 font-label-md text-xs transition-colors cursor-pointer w-full text-left"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-primary text-on-primary px-4 py-2 rounded-xl font-label-md text-sm shadow-sm hover:bg-primary-container transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">login</span>
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
