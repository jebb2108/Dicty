import { useEffect, useState } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { refreshOutline, searchOutline } from 'ionicons/icons';
import {
  fetchPopularWords,
  getPartOfSpeechLabel,
  searchWord
} from '../shared/api/dictionaryApi';
import WordDetailModal from '../components/WordDetail/WordDetailModal';

export default function SearchPage({ userId }) {
  const [query, setQuery] = useState('');
  const [popularWords, setPopularWords] = useState([]);
  const [result, setResult] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const loadPopularWords = async () => {
    if (!userId) return;

    setIsLoading(true);
    setError('');

    try {
      const payload = await fetchPopularWords(userId);
      setPopularWords(payload);
    } catch (requestError) {
      setError('Не удалось загрузить популярные запросы');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setQuery('');
    setResult(null);
    loadPopularWords();
  }, [userId]);

  const handleSearch = async (event) => {
    event.preventDefault();

    if (!userId) {
      setError('Не удалось подготовить standalone user_id');
      return;
    }

    if (!query.trim()) {
      setError('Введите слово для поиска');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const payload = await searchWord({
        userId,
        word: query.trim()
      });
      setResult(payload);
    } catch (requestError) {
      setResult(null);
      setError(requestError.message || 'Ошибка при поиске слова');
    } finally {
      setIsLoading(false);
    }
  };

  const showPopular = !result;
  const hasSearchContent =
    Boolean(result?.userWord) || Boolean(result?.otherWords?.length);

  return (
    <section className="page-shell">
      <form className="search-panel" onSubmit={handleSearch}>
        <label className="search-panel__field">
          <IonIcon icon={searchOutline} />
          <input
            type="text"
            value={query}
            placeholder="Введите слово для поиска"
            autoComplete="off"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="search-panel__actions">
          <IonButton className="primary-cta" type="submit">
            Найти
          </IonButton>
          <IonButton
            fill="clear"
            className="ghost-cta"
            type="button"
            onClick={() => {
              setQuery('');
              setResult(null);
              loadPopularWords();
            }}
          >
            <IonIcon slot="start" icon={refreshOutline} />
            Сбросить
          </IonButton>
        </div>
      </form>

      {error && <p className="page-error">{error}</p>}
      {isLoading && <p className="page-muted">Загрузка…</p>}

      {showPopular && (
        <section className="paper-section">
          <div className="section-heading">
            <div>
              <span>Популярные запросы дня</span>
              <p>Оставлены некликабельными, как в текущем `front/dict`.</p>
            </div>
          </div>

          {popularWords.length === 0 ? (
            <div className="empty-state">
              <h3>Нет данных</h3>
              <p>Популярные запросы появятся после первых поисков.</p>
            </div>
          ) : (
            <div className="popular-grid">
              {popularWords.map((word) => (
                <article key={word.id || word.word} className="popular-card">
                  <strong>{word.word}</strong>
                  <span>{word.translationsArray[0] || '—'}</span>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {result && (
        <section className="results-stack">
          {result.userWord && (
            <article
              className="result-card result-card--self"
              onClick={() => setSelectedWord(result.userWord)}
            >
              <span className="result-card__tag">Ваше слово</span>
              <h3>{result.userWord.word}</h3>
              <p>{result.userWord.translationsArray.join(', ')}</p>
            </article>
          )}

          {result.otherWords.length > 0 && (
            <section className="paper-section">
              <div className="section-heading">
                <div>
                  <span>Переводы других пользователей</span>
                  <p>Открываются в detail sheet с комментариями.</p>
                </div>
              </div>

              <div className="other-results">
                {result.otherWords.slice(0, 3).map((word) => (
                  <button
                    key={word.id}
                    className="other-word-card"
                    type="button"
                    onClick={() => setSelectedWord(word)}
                  >
                    <div>
                      <strong>{word.word}</strong>
                      <span>{word.translationsArray[0] || '—'}</span>
                    </div>
                    <div className="other-word-card__meta">
                      <span>{getPartOfSpeechLabel(word.primaryPartOfSpeech)}</span>
                      <span>{word.commentsCount} комм.</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {!hasSearchContent && (
            <div className="empty-state">
              <h3>Слово не найдено</h3>
              <p>Будьте первыми, кто сделает запись этого слова публичной.</p>
            </div>
          )}
        </section>
      )}

      <WordDetailModal
        isOpen={Boolean(selectedWord)}
        onClose={() => setSelectedWord(null)}
        userId={userId}
        word={selectedWord}
      />
    </section>
  );
}
