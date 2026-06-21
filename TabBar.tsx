import React from 'react';
import { IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { home, search, notifications, person } from 'ionicons/icons';

const TabBar: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void; }> = ({ activeTab, setActiveTab }) => {
  return (
    <IonTabBar slot="bottom">
      <IonTabButton tab="home" onClick={() => setActiveTab('Home')} selected={activeTab === 'Home'}>
        <IonIcon icon={home} />
        <IonLabel>Home</IonLabel>
      </IonTabButton>
      <IonTabButton tab="search" onClick={() => setActiveTab('Search')} selected={activeTab === 'Search'}>
        <IonIcon icon={search} />
        <IonLabel>Search</IonLabel>
      </IonTabButton>
      <IonTabButton tab="notifications" onClick={() => setActiveTab('Notifications')} selected={activeTab === 'Notifications'}>
        <IonIcon icon={notifications} />
        <IonLabel>Notifications</IonLabel>
      </IonTabButton>
      <IonTabButton tab="profile" onClick={() => setActiveTab('Profile')} selected={activeTab === 'Profile'}>
        <IonIcon icon={person} />
        <IonLabel>Profile</IonLabel>
      </IonTabButton>
    </IonTabBar>
  );
};

export default TabBar;