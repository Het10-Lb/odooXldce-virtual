import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEFAULT_USER = {
  firstName: 'Alex',
  lastName: 'Morgan',
  email: 'alex.morgan@example.com',
  phone: '+1 234 567 8900',
  city: 'Paris',
  country: 'France',
  photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  bio: 'Passionate globetrotter & travel blogger.',
};

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('gt_is_logged_in') === 'true';
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('gt_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  useEffect(() => {
    localStorage.setItem('gt_is_logged_in', isLoggedIn.toString());
    if (user) {
      localStorage.setItem('gt_user', JSON.stringify(user));
    }
  }, [isLoggedIn, user]);

  const login = (credentials) => {
    // Simulating authentication login
    const loggedUser = {
      ...user,
      email: credentials?.email || user.email,
    };
    setUser(loggedUser);
    setIsLoggedIn(true);
    return true;
  };

  const signup = (userData) => {
    // Simulating user registration
    const newUser = {
      firstName: userData.firstName || 'User',
      lastName: userData.lastName || '',
      email: userData.email || '',
      phone: userData.phone || '',
      city: userData.city || '',
      country: userData.country || '',
      photo: userData.photo || DEFAULT_USER.photo,
      bio: userData.bio || '',
    };
    setUser(newUser);
    setIsLoggedIn(true);
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
