import React from 'react';
import { IonButton } from '@ionic/react';
import useThemeToggle from './useThemeToggle';

const ThemeToggleButton: React.FC = () => {
    const { toggleTheme } = useThemeToggle();

    return (
        <IonButton onClick={toggleTheme}>Toggle Theme</IonButton>
    );
};

export default ThemeToggleButton;