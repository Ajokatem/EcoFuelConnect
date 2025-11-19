import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};

export const UserProvider = ({ children }) => {
  // Restore user and token from localStorage on initial load
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('profileUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('profileToken') || null;
    } catch {
      return null;
    }
  });

  // Update user and token after login/registration
  const updateUser = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    // Persist to localStorage
    try {
      if (userData) {
        localStorage.setItem('profileUser', JSON.stringify(userData));
      } else {
        localStorage.removeItem('profileUser');
      }
      if (jwtToken) {
        localStorage.setItem('profileToken', jwtToken);
      } else {
        localStorage.removeItem('profileToken');
      }
    } catch {}
    if (jwtToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  };

  // No localStorage: do not restore token/user on initial load

  // Keep axios in sync with token
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  return (
    <UserContext.Provider value={{ user, token, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
