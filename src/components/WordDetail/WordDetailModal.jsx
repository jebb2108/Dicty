import { useEffect, useState } from 'react';
import { IonButton, IonContent, IonModal } from '@ionic/react';
import {
  deleteComment,
  fetchComments,
  getPartOfSpeechLabel,
  postComment
} from '../../shared/api/dictionaryApi';
import { buildStandaloneProfile } from '../../shared/storage/userSession';
import './WordDetailModal.scss';

function formatRelativeDate(iso) {
  if (!iso) return '';

  const diffSeconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);

  if (diffSeconds < 60) return 'только что';
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} мин. назад`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} ч. назад`;
  if (diffSeconds < 172800) return 'вчера';

  return new Date(iso).toLocaleDateString('ru-RU');
}

export default function WordDetailModal({
  isOpen,
  onClose,
  userId,
  word
}) {
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [error, setError] = useState('');
  const isWordAuthor = String(userId || '') === String(word?.userId || '');

  const loadComments = async () => {
    if (!word?.id || !userId || !word.isPublic) {
      setComments([]);
      return;
    }

    setIsLoadingComments(true);
    setError('');

    try {
      const payload = await fetchComments({
        userId,
        wordId: word.id
      });
      setComments(payload);
    } catch (requestError) {
      setComments([]);
      setError('Не удалось загрузить комментарии');
    } finally {
      setIsLoadingComments(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    loadComments();
  }, [isOpen, userId, word?.id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userId || !word?.id) return;

    const prepared = feedbackText.trim();

    if (!prepared) {
      setError('Введите текст отзыва');
      return;
    }

    const standaloneProfile = buildStandaloneProfile(userId);

    try {
      await postComment({
        avatarLetter: standaloneProfile.avatarLetter,
        displayName: standaloneProfile.displayName,
        text: prepared,
        userId,
        wordId: word.id
      });
      setFeedbackText('');
      loadComments();
    } catch (requestError) {
      setError('Не удалось отправить отзыв');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment({
        commentId,
        userId,
        wordId: word.id
      });
      loadComments();
    } catch (requestError) {
      setError('Не удалось удалить комментарий');
    }
  };

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      initialBreakpoint={0.95}
      breakpoints={[0, 0.95]}
    >
      <IonContent className="word-detail-modal">
        <div className="detail-sheet">
          <div className="detail-sheet__hero">
            <span className="detail-sheet__eyebrow">
              {word?.isPublic ? 'Публичная карточка' : 'Приватная карточка'}
            </span>
            <h2>{word?.word}</h2>
            <p>{getPartOfSpeechLabel(word?.primaryPartOfSpeech)}</p>
          </div>

          <section className="detail-block">
            <span className="detail-block__label">Переводы</span>
            <ol className="detail-translations">
              {(word?.translationsArray || []).map((translation) => (
                <li key={translation}>{translation}</li>
              ))}
            </ol>
          </section>

          {word?.context && (
            <section className="detail-block">
              <span className="detail-block__label">Контекст</span>
              <p className="detail-context">{word.context}</p>
            </section>
          )}

          <section className="detail-block">
            <span className="detail-block__label">Обратная связь</span>
            {!word?.isPublic ? (
              <p className="detail-muted">
                Приватное слово недоступно для показа другим пользователям.
              </p>
            ) : (
              <>
                {!isWordAuthor && (
                  <form className="feedback-compose" onSubmit={handleSubmit}>
                    <textarea
                      rows={4}
                      value={feedbackText}
                      placeholder="Оставьте отзыв о переводе"
                      onChange={(event) => setFeedbackText(event.target.value)}
                    />
                    <IonButton className="primary-cta" expand="block" type="submit">
                      Отправить отзыв
                    </IonButton>
                  </form>
                )}

                {error && <p className="detail-error">{error}</p>}

                {isLoadingComments ? (
                  <p className="detail-muted">Загружаю комментарии…</p>
                ) : comments.length === 0 ? (
                  <p className="detail-muted">Пока нет комментариев</p>
                ) : (
                  <div className="comment-stack">
                    {comments.map((comment) => {
                      const canDelete =
                        isWordAuthor || String(comment.userId) === String(userId);

                      return (
                        <article key={comment.id} className="comment-card">
                          <div className="comment-card__avatar">
                            {comment.avatarLetter}
                          </div>
                          <div className="comment-card__body">
                            <div className="comment-card__topline">
                              <div>
                                <strong>{comment.displayName}</strong>
                                <span>{formatRelativeDate(comment.date)}</span>
                              </div>
                              {canDelete && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteComment(comment.id)}
                                >
                                  Удалить
                                </button>
                              )}
                            </div>
                            <p>{comment.text}</p>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </IonContent>
    </IonModal>
  );
}
