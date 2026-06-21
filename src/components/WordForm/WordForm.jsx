import { IonButton, IonIcon } from '@ionic/react';
import { addOutline, closeOutline } from 'ionicons/icons';
import './WordForm.scss';

const POS_OPTIONS = [
  { value: 'noun', label: 'Существительное' },
  { value: 'verb', label: 'Глагол' },
  { value: 'adjective', label: 'Прилагательное' },
  { value: 'adverb', label: 'Наречие' },
  { value: 'other', label: 'Другое' }
];

export function createEmptyTranslation() {
  return {
    id: Math.random().toString(36).slice(2),
    partOfSpeech: 'noun',
    text: ''
  };
}

export default function WordForm({
  context,
  isPublic,
  onAddTranslation,
  onContextChange,
  onIsPublicChange,
  onPartOfSpeechChange,
  onRemoveTranslation,
  onSubmit,
  onTranslationChange,
  submitLabel,
  translations,
  word,
  onWordChange
}) {
  return (
    <form className="word-form" onSubmit={onSubmit}>
      <label className="paper-field">
        <span>Новое слово</span>
        <input
          type="text"
          value={word}
          placeholder="Введите слово"
          autoComplete="off"
          onChange={(event) => onWordChange(event.target.value)}
        />
      </label>

      <div className="paper-switch">
        <div>
          <span className="paper-switch__label">Доступ</span>
          <p>Сделать слово публичным для поиска другими пользователями.</p>
        </div>
        <button
          className={`privacy-chip${isPublic ? ' privacy-chip--open' : ''}`}
          type="button"
          onClick={() => onIsPublicChange(!isPublic)}
        >
          {isPublic ? 'Публичное' : 'Приватное'}
        </button>
      </div>

      <section className="translations-card">
        <div className="translations-card__header">
          <div>
            <span>Переводы</span>
            <p>До 3 вариантов, каждый со своей частью речи.</p>
          </div>
          <IonButton
            fill="clear"
            className="translations-card__add"
            disabled={translations.length >= 3}
            onClick={onAddTranslation}
          >
            <IonIcon slot="start" icon={addOutline} />
            Добавить
          </IonButton>
        </div>

        <div className="translation-list">
          {translations.map((translation, index) => (
            <div key={translation.id} className="translation-row">
              <label className="paper-field">
                <span>{index + 1}. Перевод</span>
                <input
                  type="text"
                  value={translation.text}
                  placeholder="Например, meaning"
                  autoComplete="off"
                  onChange={(event) =>
                    onTranslationChange(translation.id, event.target.value)
                  }
                />
              </label>

              <label className="paper-field paper-field--select">
                <span>Часть речи</span>
                <select
                  value={translation.partOfSpeech}
                  onChange={(event) =>
                    onPartOfSpeechChange(translation.id, event.target.value)
                  }
                >
                  {POS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              {translations.length > 1 && (
                <button
                  className="translation-row__remove"
                  type="button"
                  aria-label="Удалить перевод"
                  onClick={() => onRemoveTranslation(translation.id)}
                >
                  <IonIcon icon={closeOutline} />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <label className="paper-field paper-field--textarea">
        <span>Контекст</span>
        <textarea
          rows={4}
          value={context}
          placeholder="Необязательно"
          onChange={(event) => onContextChange(event.target.value)}
        />
      </label>

      <IonButton className="primary-cta" expand="block" type="submit">
        {submitLabel}
      </IonButton>
    </form>
  );
}
