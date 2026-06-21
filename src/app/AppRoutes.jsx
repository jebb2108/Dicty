import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout/Layout';

const AddWordPage = lazy(() => import('../pages/AddWordPage'));
const DictionaryPage = lazy(() => import('../pages/DictionaryPage'));
const SearchPage = lazy(() => import('../pages/SearchPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const StatsPage = lazy(() => import('../pages/StatsPage'));

function RouteShell({ children, ...props }) {
  return (
    <Layout {...props}>
      <Suspense fallback={<section className="page-shell"><p className="page-muted">Загрузка экрана…</p></section>}>
        {children}
      </Suspense>
    </Layout>
  );
}

export function AppRoutes(props) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RouteShell title="Добавить слово" {...props}>
            <AddWordPage {...props} />
          </RouteShell>
        }
      />
      <Route
        path="/search"
        element={
          <RouteShell title="Поиск слова" {...props}>
            <SearchPage {...props} />
          </RouteShell>
        }
      />
      <Route
        path="/dictionary"
        element={
          <RouteShell title="Мой словарь" {...props}>
            <DictionaryPage {...props} />
          </RouteShell>
        }
      />
      <Route
        path="/stats"
        element={
          <RouteShell title="Статистика" {...props}>
            <StatsPage {...props} />
          </RouteShell>
        }
      />
      <Route
        path="/settings"
        element={
          <RouteShell title="Настройки" {...props}>
            <SettingsPage {...props} />
          </RouteShell>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
