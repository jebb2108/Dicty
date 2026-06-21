import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setTheme(matchMedia.matches ? 'dark' : 'light');
    matchMedia.addEventListener('change', handleChange);
    handleChange();
    return () => matchMedia.removeEventListener('change', handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);