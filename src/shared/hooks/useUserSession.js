import { useState } from 'react';
import {
  createAndStoreStandaloneUserId,
  getStandaloneUserIdPolicy,
  resolveInitialUserSession,
  setStoredUserId
} from '../storage/userSession';

const SOURCE_LABELS = {
  generated: 'сгенерирован приложением',
  manual: 'задан вручную в standalone namespace',
  none: 'не задан',
  regenerated: 'пересоздан приложением',
  storage: 'восстановлен из памяти устройства',
};

export function useUserSession() {
  const [session, setSession] = useState(() => resolveInitialUserSession());

  const saveUserId = (userId) => {
    const normalized = setStoredUserId(userId);

    setSession({
      source: normalized ? 'manual' : 'none',
      userId: normalized
    });
  };

  const clearUserId = () => {
    const regeneratedUserId = createAndStoreStandaloneUserId();
    setSession({
      source: 'regenerated',
      userId: regeneratedUserId
    });
  };

  const policy = getStandaloneUserIdPolicy();

  return {
    clearUserId,
    standaloneUserIdPolicy: policy,
    saveUserId,
    sessionSource: session.source,
    sessionSourceLabel: SOURCE_LABELS[session.source] || SOURCE_LABELS.none,
    userId: session.userId
  };
}
