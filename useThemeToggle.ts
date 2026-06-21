import React, { useEffect } from 'react';

const useThemeToggle = () => {
    useEffect(() => {
        const theme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', theme);
    }, []);

    const toggleTheme = () => {
        let currentTheme = localStorage.getItem('theme');
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme);
        document.body.setAttribute('data-theme', currentTheme);
    };

    return { toggleTheme };
};

export default useThemeToggle;