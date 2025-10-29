import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light');

  // Load theme from default or backend user profile
  useEffect(() => {
    // TODO: Optionally fetch user theme from backend profile
    setCurrentTheme('light');
    applyTheme('light');
  }, []);

  const applyTheme = (theme) => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      // Dark theme CSS variables
      root.style.setProperty('--bs-body-bg', '#1a1a1a');
      root.style.setProperty('--bs-body-color', '#ffffff');
      root.style.setProperty('--bs-card-bg', '#2d2d2d');
      root.style.setProperty('--bs-border-color', '#404040');
      root.style.setProperty('--bs-secondary-bg', '#3d3d3d');
      root.style.setProperty('--bs-tertiary-bg', '#2d2d2d');
      root.style.setProperty('--bs-navbar-bg', '#2d2d2d');
      root.style.setProperty('--bs-sidebar-bg', '#252525');
      root.style.setProperty('--bs-text-muted', '#adb5bd');
      root.style.setProperty('--bs-link-color', '#0dcaf0');
      root.style.setProperty('--bs-link-hover-color', '#3dd5f3');
      
      // Custom theme colors
      root.style.setProperty('--primary-green', '#28a745');
      root.style.setProperty('--primary-green-hover', '#218838');
      root.style.setProperty('--card-shadow', '0 4px 6px rgba(0, 0, 0, 0.3)');
      root.style.setProperty('--input-bg', '#3d3d3d');
      root.style.setProperty('--input-border', '#555555');
      
      document.body.setAttribute('data-bs-theme', 'dark');
    } else {
      // Light theme CSS variables (default)
      root.style.setProperty('--bs-body-bg', '#ffffff');
      root.style.setProperty('--bs-body-color', '#212529');
      root.style.setProperty('--bs-card-bg', '#ffffff');
      root.style.setProperty('--bs-border-color', '#dee2e6');
      root.style.setProperty('--bs-secondary-bg', '#f8f9fa');
      root.style.setProperty('--bs-tertiary-bg', '#f8f9fa');
      root.style.setProperty('--bs-navbar-bg', '#ffffff');
      root.style.setProperty('--bs-sidebar-bg', '#ffffff');
      root.style.setProperty('--bs-text-muted', '#6c757d');
      root.style.setProperty('--bs-link-color', '#0d6efd');
      root.style.setProperty('--bs-link-hover-color', '#0a58ca');
      
      // Custom theme colors
      root.style.setProperty('--primary-green', '#28a745');
      root.style.setProperty('--primary-green-hover', '#218838');
      root.style.setProperty('--card-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--input-bg', '#ffffff');
      root.style.setProperty('--input-border', '#ced4da');
      
      document.body.setAttribute('data-bs-theme', 'light');
    }
  };

  const changeTheme = (theme) => {
    setCurrentTheme(theme);
    // Optionally sync with backend user profile
    applyTheme(theme);
  };

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    changeTheme(newTheme);
  };

  const getThemeStyles = () => {
    return {
      backgroundColor: currentTheme === 'dark' ? '#1a1a1a' : '#ffffff',
      color: currentTheme === 'dark' ? '#ffffff' : '#212529',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    };
  };

  const getCardStyles = () => {
    return {
      backgroundColor: currentTheme === 'dark' ? '#2d2d2d' : '#ffffff',
      border: `1px solid ${currentTheme === 'dark' ? '#404040' : '#dee2e6'}`,
      boxShadow: currentTheme === 'dark' 
        ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
        : '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease'
    };
  };

  const getInputStyles = () => {
    return {
      backgroundColor: currentTheme === 'dark' ? '#3d3d3d' : '#ffffff',
      border: `1px solid ${currentTheme === 'dark' ? '#555555' : '#ced4da'}`,
      color: currentTheme === 'dark' ? '#ffffff' : '#212529'
    };
  };

  const value = {
    currentTheme,
    changeTheme,
    toggleTheme,
    isDark: currentTheme === 'dark',
    isLight: currentTheme === 'light',
    getThemeStyles,
    getCardStyles,
    getInputStyles,
    availableThemes: [
      { value: 'light', label: 'Light', icon: '☀️' },
      { value: 'dark', label: 'Dark', icon: '🌙' }
    ]
  };

  return (
    <ThemeContext.Provider value={value}>
      <div style={getThemeStyles()} className="min-vh-100">
        {children}
      </div>
    </ThemeContext.Provider>
  );
};