import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Update user and token after login/registration
  const updateUser = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
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
