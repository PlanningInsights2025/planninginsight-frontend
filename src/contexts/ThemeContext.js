import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Theme Context
const ThemeContext = createContext();

/**
 * Theme Provider Component
 * Manages application theme (light/dark mode) and provides theme utilities
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [systemPreference, setSystemPreference] = useState('light');

  /**
   * Initialize theme from localStorage or system preference
   */
  useEffect(() => {
    // Get saved theme from localStorage
    const savedTheme = localStorage.getItem('planning-insights-theme');
    
    // Get system preference
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setSystemPreference(systemTheme);

    // Set initial theme
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  /**
   * Listen for system theme changes
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      setSystemPreference(newSystemTheme);
      
      // Only change theme if no manual selection is saved
      const savedTheme = localStorage.getItem('planning-insights-theme');
      if (!savedTheme) {
        setTheme(newSystemTheme);
        applyTheme(newSystemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  /**
   * Apply theme to document and CSS variables
   */
  const applyTheme = (themeName) => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('theme-light', 'theme-dark');
    
    // Add new theme class
    root.classList.add(`theme-${themeName}`);
    
    // Update CSS variables based on theme
    updateCSSVariables(themeName);
  };

  /**
   * Update CSS custom properties based on theme
   */
  const updateCSSVariables = (themeName) => {
    const root = document.documentElement;
    const themes = {
      light: {
        '--background-color': '#ffffff',
        '--surface-color': '#f8fafc',
        '--text-primary': '#1e293b',
        '--text-secondary': '#64748b',
        '--border-color': '#e2e8f0',
        '--shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        '--shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        '--shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      },
      dark: {
        '--background-color': '#0f172a',
        '--surface-color': '#1e293b',
        '--text-primary': '#f1f5f9',
        '--text-secondary': '#94a3b8',
        '--border-color': '#334155',
        '--shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
        '--shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        '--shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
      }
    };

    const themeVariables = themes[themeName] || themes.light;
    
    Object.entries(themeVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  };

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('planning-insights-theme', newTheme);
    applyTheme(newTheme);
  };

  /**
   * Set specific theme
   */
  const setThemeMode = (themeName) => {
    if (!['light', 'dark'].includes(themeName)) {
      console.warn(`Invalid theme: ${themeName}. Using 'light' instead.`);
      themeName = 'light';
    }
    
    setTheme(themeName);
    localStorage.setItem('planning-insights-theme', themeName);
    applyTheme(themeName);
  };

  /**
   * Reset to system preference
   */
  const resetToSystem = () => {
    localStorage.removeItem('planning-insights-theme');
    setTheme(systemPreference);
    applyTheme(systemPreference);
  };

  /**
   * Check if current theme is dark
   */
  const isDark = theme === 'dark';

  /**
   * Check if using system preference
   */
  const isSystemTheme = !localStorage.getItem('planning-insights-theme');

  const value = {
    theme,
    systemPreference,
    isDark,
    isSystemTheme,
    toggleTheme,
    setTheme: setThemeMode,
    resetToSystem
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to use theme context
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

export default ThemeContext;