import React, { useEffect } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton } from '@ionic/react';
import useThemeToggle from '../hooks/useThemeToggle';

const Header: React.FC = () => {
  const [theme, toggleTheme] = useThemeToggle();
  
  return (
    <IonHeader>
      <IonToolbar>
        <IonTitle>Dicty</IonTitle>
        <IonButtons slot="end">
          <IonButton onClick={toggleTheme}>Toggle Theme</IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;