import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './app/AppRoutes';
import { useDictionaryApp } from './shared/hooks/useDictionaryApp';
import './styles/app.scss';

export default function App() {
  const appState = useDictionaryApp();

  return (
    <BrowserRouter>
      <AppRoutes {...appState} />
    </BrowserRouter>
  );
}
