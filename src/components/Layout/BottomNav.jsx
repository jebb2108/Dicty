import { IonIcon } from '@ionic/react';
import {
  addCircleOutline,
  barChartOutline,
  bookOutline,
  searchOutline
} from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import './BottomNav.scss';

const NAV_ITEMS = [
  { icon: addCircleOutline, label: 'Добавить', path: '/' },
  { icon: searchOutline, label: 'Поиск', path: '/search' },
  { icon: bookOutline, label: 'Словарь', path: '/dictionary' },
  { icon: barChartOutline, label: 'Статистика', path: '/stats' }
];

export default function BottomNav({ pathname }) {
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav-shell" aria-label="Основная навигация">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.path;

        return (
          <button
            key={item.path}
            className={`bottom-nav-item${isActive ? ' bottom-nav-item--active' : ''}`}
            type="button"
            onClick={() => navigate(item.path)}
          >
            <IonIcon icon={item.icon} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
