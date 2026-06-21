import { useEffect, useRef, useState } from 'react';
import { fetchNotifications, fetchWords } from '../api/dictionaryApi';
import { useUserSession } from './useUserSession';

const POLL_INTERVAL_MS = 30000;

export function useDictionaryApp() {
  const {
    clearUserId,
    saveUserId,
    sessionSource,
    sessionSourceLabel,
    standaloneUserIdPolicy,
    userId
  } = useUserSession();
  const [words, setWords] = useState([]);
  const [isWordsLoading, setIsWordsLoading] = useState(false);
  const [wordsError, setWordsError] = useState('');
  const [editingWord, setEditingWord] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const seenNotificationKeysRef = useRef(new Set());

  const loadWords = async () => {
    if (!userId) {
      setWords([]);
      setWordsError('');
      return;
    }

    setIsWordsLoading(true);
    setWordsError('');

    try {
      const payload = await fetchWords(userId);
      setWords(payload);
    } catch (error) {
      setWords([]);
      setWordsError(error.message || 'Не удалось загрузить слова');
    } finally {
      setIsWordsLoading(false);
    }
  };

  useEffect(() => {
    loadWords();
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      seenNotificationKeysRef.current.clear();
      return undefined;
    }

    let cancelled = false;

    const poll = async () => {
      try {
        const payload = await fetchNotifications(userId);

        if (cancelled || payload.length === 0) return;

        const prepared = payload
          .map((item, index) => {
            const text = item.text || item.message || JSON.stringify(item);
            const type = item.type || 'success';
            const key = `${text}:${type}:${item.date || item.created_at || index}`;

            return {
              key,
              text,
              timeLabel: new Date().toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
              }),
              type
            };
          })
          .filter((item) => {
            if (seenNotificationKeysRef.current.has(item.key)) return false;

            seenNotificationKeysRef.current.add(item.key);
            return true;
          });

        if (prepared.length > 0) {
          setNotifications((current) => [...prepared.reverse(), ...current].slice(0, 30));
        }
      } catch (error) {
        // Polling stays silent to match the existing web behavior.
      }
    };

    poll();
    const timer = window.setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [userId]);

  return {
    clearNotifications: () => setNotifications([]),
    clearUserId,
    editingWord,
    isWordsLoading,
    loadWords,
    notifications,
    saveUserId,
    sessionSource,
    sessionSourceLabel,
    setEditingWord,
    standaloneUserIdPolicy,
    userId,
    words,
    wordsError
  };
}
