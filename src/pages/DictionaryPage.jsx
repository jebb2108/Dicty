import { useDeferredValue, useState } from 'react';
import { IonAlert, IonButton } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import {
  deleteWord as deleteWordRequest,
  getPartOfSpeechLabel
} from '../shared/api/dictionaryApi';
import WordDetailModal from '../components/WordDetail/WordDetailModal';

function groupWords(words, query) {
  const normalizedQuery = String(query || '').trim().toLowerCase();

  return words.reduce((groups, word) => {
    if (
      normalizedQuery &&
      !word.word.toLowerCase().includes(normalizedQuery) &&
      !word.translationsArray.some((translation) =>
        translation.toLowerCase().includes(normalizedQuery)
      )
    ) {
      return groups;
    }

    const letter = (word.word[0] || '#').toUpperCase();

    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(word);
    return groups;
  }, {});
}

export default function DictionaryPage({
  isWordsLoading,
  loadWords,
  setEditingWord,
  userId,
  words,
  wordsError
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedWord, setSelectedWord] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [actionError, setActionError] = useState('');
  const deferredQuery = useDeferredValue(query);
  const groups = groupWords(words, deferredQuery);
  const letters = Object.keys(groups).sort((left, right) => left.localeCompare(right, 'ru'));

  const handleEdit = (word) => {
    setEditingWord(word);
    navigate('/');
  };

  const handleDelete = async () => {
    if (!pendingDelete || !userId) return;

    try {
      await deleteWordRequest({
        userId,
        wordId: pendingDelete.id
      });
      setPendingDelete(null);
      setActionError('');
      loadWords();
    } catch (error) {
      setActionError(error.message || 'Не удалось удалить слово');
    }
  };

  return (
    <section className="page-shell">
      <section className="paper-section">
        <div className="section-heading">
          <div>
            <span>Весь словарь</span>
            <p>Мобильный список с группировкой по первой букве вместо старого card carousel.</p>
          </div>
          <IonButton fill="clear" className="ghost-cta" onClick={loadWords}>
            Обновить
          </IonButton>
        </div>

        <label className="paper-field paper-field--compact">
          <span>Фильтр</span>
          <input
            type="search"
            value={query}
            placeholder="Слово или перевод"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        {wordsError && <p className="page-error">{wordsError}</p>}
        {actionError && <p className="page-error">{actionError}</p>}
        {isWordsLoading && <p className="page-muted">Загрузка слов…</p>}

        {!isWordsLoading && letters.length === 0 && (
          <div className="empty-state">
            <h3>Пустой словарь</h3>
            <p>Добавленные слова появятся здесь.</p>
          </div>
        )}

        <div className="dictionary-groups">
          {letters.map((letter) => (
            <section key={letter} className="dictionary-group">
              <header className="dictionary-group__header">{letter}</header>
              <div className="dictionary-group__list">
                {groups[letter].map((word) => (
                  <article key={word.id} className="dictionary-card">
                    <button
                      className="dictionary-card__body"
                      type="button"
                      onClick={() => setSelectedWord(word)}
                    >
                      <div className="dictionary-card__headline">
                        <div>
                          <h3>{word.word}</h3>
                          <p>{word.translationsArray.join(', ')}</p>
                        </div>
                        <span className="dictionary-card__pos">
                          {getPartOfSpeechLabel(word.primaryPartOfSpeech)}
                        </span>
                      </div>
                      <div className="dictionary-card__meta">
                        <span>{word.isPublic ? 'Публичное' : 'Приватное'}</span>
                        {word.context && <span>{word.context}</span>}
                      </div>
                    </button>

                    <div className="dictionary-card__actions">
                      <button type="button" onClick={() => handleEdit(word)}>
                        Изменить
                      </button>
                      <button
                        type="button"
                        className="danger-link"
                        onClick={() => setPendingDelete(word)}
                      >
                        Удалить
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <WordDetailModal
        isOpen={Boolean(selectedWord)}
        onClose={() => setSelectedWord(null)}
        userId={userId}
        word={selectedWord}
      />

      <IonAlert
        isOpen={Boolean(pendingDelete)}
        header="Удалить слово?"
        message={pendingDelete?.word || ''}
        onDidDismiss={() => setPendingDelete(null)}
        buttons={[
          {
            role: 'cancel',
            text: 'Отмена'
          },
          {
            handler: handleDelete,
            text: 'Удалить'
          }
        ]}
      />
    </section>
  );
}
