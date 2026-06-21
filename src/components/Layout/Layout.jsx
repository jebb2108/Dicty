import { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonModal,
  IonPage
} from '@ionic/react';
import { notificationsOutline, settingsOutline } from 'ionicons/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import './Layout.scss';

export default function Layout({
  children,
  clearNotifications,
  notifications,
  title
}) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const unreadCount = notifications.length;

  return (
    <IonPage className="app-layout">
      <header className="app-header">
        <div className="app-header__title-wrap">
          <span className="app-header__eyebrow">LLLang Dictionary</span>
          <h1 className="app-header__title">{title}</h1>
        </div>

        <div className="app-header__actions">
          <button
            className="header-icon-btn"
            type="button"
            aria-label="Открыть уведомления"
            onClick={() => setIsNotifOpen(true)}
          >
            <IonIcon icon={notificationsOutline} />
            {unreadCount > 0 && (
              <span className="header-icon-btn__badge">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <button
            className="header-icon-btn"
            type="button"
            aria-label="Открыть настройки"
            onClick={() => navigate('/settings')}
          >
            <IonIcon icon={settingsOutline} />
          </button>
        </div>
      </header>

      <IonContent className="app-layout__scroll" fullscreen>
        <main className="app-layout__content">{children}</main>
      </IonContent>

      <BottomNav pathname={location.pathname} />

      <IonModal
        isOpen={isNotifOpen}
        onDidDismiss={() => setIsNotifOpen(false)}
        initialBreakpoint={0.75}
        breakpoints={[0, 0.75, 1]}
      >
        <IonContent className="notif-sheet">
          <div className="sheet-header">
            <div>
              <p className="sheet-header__eyebrow">Inbox</p>
              <h2 className="sheet-header__title">Уведомления</h2>
            </div>
            <IonButton
              fill="clear"
              className="sheet-header__clear"
              onClick={clearNotifications}
            >
              Очистить
            </IonButton>
          </div>

          <div className="notif-sheet__list">
            {notifications.length === 0 ? (
              <div className="empty-state">
                <h3>Пока пусто</h3>
                <p>Новые события из Kafka-backed bell появятся здесь.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <article
                  key={notification.key}
                  className={`notif-card notif-card--${notification.type}`}
                >
                  <span className="notif-card__dot" />
                  <div className="notif-card__body">
                    <p>{notification.text}</p>
                    <span>{notification.timeLabel}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </IonContent>
      </IonModal>
    </IonPage>
  );
}
