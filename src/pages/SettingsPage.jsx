import { useEffect, useState } from 'react';
import { IonButton } from '@ionic/react';
import { API_BASE_URL } from '../shared/api/dictionaryApi';

export default function SettingsPage({
  clearUserId,
  saveUserId,
  sessionSourceLabel,
  standaloneUserIdPolicy,
  userId
}) {
  const [draftUserId, setDraftUserId] = useState(userId);
  const [error, setError] = useState('');

  useEffect(() => {
    setDraftUserId(userId);
  }, [userId]);

  const handleSave = () => {
    try {
      saveUserId(draftUserId);
      setError('');
    } catch (saveError) {
      setError('Введите standalone user_id в app-namespace');
    }
  };

  return (
    <section className="page-shell">
      <section className="paper-section">
        <div className="section-heading">
          <div>
            <span>User session</span>
            <p>Приложение автономно создаёт numeric `user_id` в отдельном namespace и не использует Telegram identity.</p>
          </div>
        </div>

        <label className="paper-field">
          <span>user_id</span>
          <input
            type="text"
            inputMode="numeric"
            value={draftUserId}
            placeholder={`Например, ${standaloneUserIdPolicy.prefix}...`}
            onChange={(event) => setDraftUserId(event.target.value.replace(/\D/g, ''))}
          />
        </label>

        <div className="settings-meta">
          <span>Текущий источник: {sessionSourceLabel}</span>
          <span>
            Namespace: {standaloneUserIdPolicy.length} цифр, префикс {standaloneUserIdPolicy.prefix}
          </span>
          <span>API base: {API_BASE_URL}</span>
        </div>

        {error && <p className="page-error">{error}</p>}

        <div className="settings-actions">
          <IonButton className="primary-cta" expand="block" onClick={handleSave}>
            Сохранить user_id
          </IonButton>
          <IonButton fill="clear" className="ghost-cta" expand="block" onClick={() => {
            clearUserId();
            setError('');
          }}>
            Сгенерировать новый user_id
          </IonButton>
        </div>
      </section>
    </section>
  );
}
