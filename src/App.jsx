import React from 'react';
import { IonApp } from '@ionic/react';
import AppRouter from './Router';
import { IonHeader, IonContent, IonFooter } from '@ionic/react';

const App: React.FC = () => {
  return (
    <IonApp>
      <IonHeader>
        <h1>Dicty App</h1>
      </IonHeader>
      <IonContent>
        <AppRouter />
      </IonContent>
      <IonFooter>
        <p>&copy; 2023 Dicty App</p>
      </IonFooter>
    </IonApp>
  );
};

export default App;