export const API_BASE_URL =
  import.meta.env.VITE_DICT_API_BASE_URL || 'https://dict.lllang.site';

const POS_LABELS = {
  adjective: 'Прилагательное',
  adverb: 'Наречие',
  noun: 'Существительное',
  other: 'Другое',
  verb: 'Глагол'
};

function isSameOrigin(url) {
  try {
    const parsed = new URL(url, window.location.href);

    return parsed.origin === window.location.origin;
  } catch (error) {
    return false;
  }
}

function sortTranslationKeys(translations) {
  return Object.keys(translations).sort((left, right) => Number(left) - Number(right));
}

function toTranslationsArray(word) {
  if (word.translations && typeof word.translations === 'object') {
    return sortTranslationKeys(word.translations)
      .map((key) => word.translations[key]?.translation)
      .filter(Boolean);
  }

  if (Array.isArray(word.translation)) return word.translation.filter(Boolean);
  if (word.translation) return [word.translation];

  return [];
}

function toOriginalTranslations(word, translationsArray) {
  if (word.translations && typeof word.translations === 'object') {
    return word.translations;
  }

  return Object.fromEntries(
    translationsArray.map((translation, index) => [
      String(index + 1),
      {
        part_of_speech: word.part_of_speech || 'noun',
        translation
      }
    ])
  );
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: isSameOrigin(API_BASE_URL) ? 'include' : 'omit',
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {})
    }
  });

  if (response.status === 204) return null;

  const text = await response.text();
  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch (error) {
      payload = text;
    }
  }

  if (!response.ok) {
    const message =
      payload?.detail ||
      payload?.message ||
      payload?.error ||
      (typeof payload === 'string' ? payload : null) ||
      `HTTP ${response.status}`;

    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return payload;
}

export function getPartOfSpeechLabel(code) {
  return POS_LABELS[code] || 'Другое';
}

export function normalizeWord(word) {
  const translationsArray = toTranslationsArray(word);
  const originalTranslations = toOriginalTranslations(word, translationsArray);
  const primaryTranslation = originalTranslations['1'];

  return {
    commentsCount: word.comments || 0,
    context: word.context || '',
    createdAt: word.created_at || null,
    dislikes: word.dislikes || 0,
    id: String(word.id || word.word_id || ''),
    isPublic: Boolean(word.is_public),
    likes: word.likes || 0,
    nickname: word.nickname || '',
    originalTranslations,
    primaryPartOfSpeech:
      primaryTranslation?.part_of_speech || word.part_of_speech || 'noun',
    translationsArray,
    userId: String(word.user_id || ''),
    word: String(word.word || '')
  };
}

export function normalizeComment(comment) {
  return {
    avatarLetter: comment.avatar_letter ?? comment.avatarLetter ?? 'U',
    date: comment.date,
    displayName: comment.display_name ?? comment.displayName ?? 'user',
    id: String(comment.id ?? ''),
    likedByAuthor: Boolean(comment.liked_by_author ?? comment.likedByAuthor),
    text: comment.text || '',
    userId: String(comment.user_id ?? comment.userId ?? '')
  };
}

export function buildTranslationsPayload(entries) {
  const prepared = {};

  entries.forEach((entry) => {
    const translation = String(entry.text || '').trim();

    if (translation) {
      prepared[translation] = entry.partOfSpeech || 'noun';
    }
  });

  return prepared;
}

export async function fetchWords(userId) {
  const payload = await request(
    `/api/dict/words?user_id=${encodeURIComponent(userId)}`
  );

  return Array.isArray(payload)
    ? payload.map(normalizeWord).sort((left, right) => left.word.localeCompare(right.word, 'ru'))
    : [];
}

export async function saveWord({
  context,
  isPublic,
  translations,
  userId,
  word,
  wordId
}) {
  const method = wordId ? 'PUT' : 'POST';
  const payload = {
    context: String(context || '').trim(),
    is_public: Boolean(isPublic),
    translations,
    user_id: userId,
    word: String(word || '').trim().toLowerCase()
  };

  if (wordId) {
    payload.word_id = wordId;
  }

  return request('/api/dict/words', {
    body: JSON.stringify(payload),
    method
  });
}

export async function deleteWord({ userId, wordId }) {
  return request(
    `/api/dict/words?user_id=${encodeURIComponent(userId)}&word_id=${encodeURIComponent(wordId)}`,
    {
      method: 'DELETE'
    }
  );
}

export async function fetchPopularWords(userId) {
  const payload = await request(
    `/api/dict/words/popular?user_id=${encodeURIComponent(userId)}`
  );

  return Array.isArray(payload) ? payload.map(normalizeWord) : [];
}

export async function searchWord({ userId, word }) {
  const payload = await request(
    `/api/dict/words/search?user_id=${encodeURIComponent(userId)}&word=${encodeURIComponent(word.toLowerCase())}`
  );

  const otherWords = [];

  Object.values(payload?.all_users_words || {}).forEach((items) => {
    if (!Array.isArray(items)) return;

    items.forEach((item) => {
      if (item) otherWords.push(normalizeWord(item));
    });
  });

  return {
    otherWords,
    userWord: payload?.user_word ? normalizeWord(payload.user_word) : null
  };
}

export async function fetchStats(userId) {
  return request(`/api/dict/stats?user_id=${encodeURIComponent(userId)}`);
}

export async function fetchLeaderboard(userId) {
  const payload = await request(
    `/api/dict/leaderboard?user_id=${encodeURIComponent(userId)}`
  );

  return Array.isArray(payload) ? payload : [];
}

export async function fetchComments({ userId, wordId }) {
  const payload = await request(
    `/api/dict/comments?word_id=${encodeURIComponent(wordId)}&user_id=${encodeURIComponent(userId)}`
  );

  return Array.isArray(payload) ? payload.map(normalizeComment) : [];
}

export async function postComment({
  avatarLetter,
  displayName,
  text,
  userId,
  wordId
}) {
  return request('/api/dict/comments', {
    body: JSON.stringify({
      avatar_letter: avatarLetter,
      display_name: displayName,
      text,
      user_id: String(userId),
      word_id: String(wordId)
    }),
    method: 'POST'
  });
}

export async function deleteComment({ commentId, userId, wordId }) {
  return request(
    `/api/dict/comments?comment_id=${encodeURIComponent(commentId)}&word_id=${encodeURIComponent(wordId)}&user_id=${encodeURIComponent(userId)}`,
    {
      method: 'DELETE'
    }
  );
}

export async function fetchNotifications(userId) {
  const payload = await request(
    `/api/dict/notifications?user_id=${encodeURIComponent(userId)}`
  );

  return Array.isArray(payload) ? payload : [];
}
