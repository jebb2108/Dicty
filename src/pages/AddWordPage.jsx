import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  buildTranslationsPayload,
  saveWord as saveWordRequest
} from '../shared/api/dictionaryApi';
import WordForm, {
  createEmptyTranslation
} from '../components/WordForm/WordForm';

function toDraftTranslations(editingWord) {
  const keys = Object.keys(editingWord?.originalTranslations || {}).sort(
    (left, right) => Number(left) - Number(right)
  );

  if (keys.length === 0) {
    return [createEmptyTranslation()];
  }

  return keys.map((key) => ({
    id: `${editingWord.id}-${key}`,
    partOfSpeech:
      editingWord.originalTranslations[key]?.part_of_speech || 'noun',
    text: editingWord.originalTranslations[key]?.translation || ''
  }));
}

export default function AddWordPage({
  editingWord,
  loadWords,
  setEditingWord,
  userId
}) {
  const navigate = useNavigate();
  const [word, setWord] = useState('');
  const [context, setContext] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [translations, setTranslations] = useState([createEmptyTranslation()]);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!editingWord) {
      setWord('');
      setContext('');
      setIsPublic(false);
      setTranslations([createEmptyTranslation()]);
      return;
    }

    setWord(editingWord.word);
    setContext(editingWord.context || '');
    setIsPublic(Boolean(editingWord.isPublic));
    setTranslations(toDraftTranslations(editingWord));
  }, [editingWord]);

  const updateTranslation = (translationId, patch) => {
    setTranslations((current) =>
      current.map((item) =>
        item.id === translationId ? { ...item, ...patch } : item
      )
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userId) {
      setError('Не удалось подготовить standalone user_id');
      navigate('/settings');
      return;
    }

    const preparedWord = word.trim();
    const preparedTranslations = buildTranslationsPayload(translations);

    if (!preparedWord) {
      setError('Введите слово');
      return;
    }

    if (Object.keys(preparedTranslations).length === 0) {
      setError('Добавьте хотя бы один перевод');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      await saveWordRequest({
        context,
        isPublic,
        translations: preparedTranslations,
        userId,
        word: preparedWord,
        wordId: editingWord?.id || ''
      });
      setEditingWord(null);
      await loadWords();
      setWord('');
      setContext('');
      setIsPublic(false);
      setTranslations([createEmptyTranslation()]);
      navigate('/dictionary');
    } catch (requestError) {
      setError(requestError.message || 'Не удалось сохранить слово');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="page-shell">
      <div className="hero-card">
        <span className="hero-card__eyebrow">Book chapter one</span>
        <h2>{editingWord ? 'Редактирование карточки' : 'Новая словарная карточка'}</h2>
        <p>
          Мобильная версия сохраняет тот же `POST/PUT /api/dict/words` контракт,
          что и текущий `front/dict`.
        </p>
      </div>

      {error && <p className="page-error">{error}</p>}

      <WordForm
        context={context}
        isPublic={isPublic}
        onAddTranslation={() =>
          setTranslations((current) =>
            current.length >= 3 ? current : [...current, createEmptyTranslation()]
          )
        }
        onContextChange={setContext}
        onIsPublicChange={setIsPublic}
        onPartOfSpeechChange={(translationId, value) =>
          updateTranslation(translationId, { partOfSpeech: value })
        }
        onRemoveTranslation={(translationId) =>
          setTranslations((current) =>
            current.filter((item) => item.id !== translationId)
          )
        }
        onSubmit={handleSubmit}
        onTranslationChange={(translationId, value) =>
          updateTranslation(translationId, { text: value })
        }
        onWordChange={setWord}
        submitLabel={isSaving ? 'Сохраняю…' : editingWord ? 'Сохранить правки' : 'Добавить в словарь'}
        translations={translations}
        word={word}
      />
    </section>
  );
}
