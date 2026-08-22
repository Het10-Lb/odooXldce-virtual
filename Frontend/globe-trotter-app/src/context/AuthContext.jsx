import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getMe } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem('gt_access_token'));
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('gt_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Validate session on mount if token exists
  useEffect(() => {
    let isMounted = true;
    async function checkAuthSession() {
      const token = localStorage.getItem('gt_access_token');
      if (token) {
        try {
          const currentUser = await getMe();
          if (isMounted) {
            setUser(currentUser);
            setIsLoggedIn(true);
            localStorage.setItem('gt_user', JSON.stringify(currentUser));
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          if (isMounted) {
            localStorage.removeItem('gt_access_token');
            localStorage.removeItem('gt_user');
            setUser(null);
            setIsLoggedIn(false);
          }
        }
      } else {
        if (isMounted) {
          setIsLoggedIn(false);
          setUser(null);
        }
      }
      if (isMounted) {
        setIsLoadingAuth(false);
      }
    }

    checkAuthSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    if (data?.tokens?.accessToken) {
      localStorage.setItem('gt_access_token', data.tokens.accessToken);
    }
    if (data?.user) {
      setUser(data.user);
      localStorage.setItem('gt_user', JSON.stringify(data.user));
    }
    setIsLoggedIn(true);
    return data.user;
  };

  const signup = async (userData) => {
    const data = await registerUser(userData);
    if (data?.tokens?.accessToken) {
      localStorage.setItem('gt_access_token', data.tokens.accessToken);
    }
    if (data?.user) {
      setUser(data.user);
      localStorage.setItem('gt_user', JSON.stringify(data.user));
    }
    setIsLoggedIn(true);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('gt_access_token');
    localStorage.removeItem('gt_user');
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, signup, logout, isLoadingAuth }}>
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
