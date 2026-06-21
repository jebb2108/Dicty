const STORAGE_KEY = 'lllang-dict-mobile-user-id';
const APP_USER_ID_PREFIX = '8';
const APP_USER_ID_LENGTH = 16;

function normalizeDigitString(value) {
  return String(value ?? '').replace(/\D/g, '');
}

export function isStandaloneUserId(value) {
  const digits = normalizeDigitString(value);

  return (
    digits.length === APP_USER_ID_LENGTH &&
    digits.startsWith(APP_USER_ID_PREFIX)
  );
}

function generateRandomDigit() {
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    const buffer = new Uint32Array(1);
    window.crypto.getRandomValues(buffer);
    return String(buffer[0] % 10);
  }

  return String(Math.floor(Math.random() * 10));
}

export function generateStandaloneUserId() {
  let generated = APP_USER_ID_PREFIX;

  while (generated.length < APP_USER_ID_LENGTH) {
    generated += generateRandomDigit();
  }

  return generated;
}

export function getStoredUserId() {
  if (typeof window === 'undefined') return '';

  const stored = normalizeDigitString(window.localStorage.getItem(STORAGE_KEY));

  return isStandaloneUserId(stored) ? stored : '';
}

export function setStoredUserId(userId) {
  if (typeof window === 'undefined') return '';

  const normalized = normalizeDigitString(userId);

  if (!isStandaloneUserId(normalized)) {
    throw new Error(
      `Standalone user_id must be a ${APP_USER_ID_LENGTH}-digit number starting with ${APP_USER_ID_PREFIX}`
    );
  }

  window.localStorage.setItem(STORAGE_KEY, normalized);
  return normalized;
}

export function createAndStoreStandaloneUserId() {
  if (typeof window === 'undefined') return '';

  const generated = generateStandaloneUserId();
  window.localStorage.setItem(STORAGE_KEY, generated);
  return generated;
}

export function buildStandaloneProfile(userId) {
  const normalized = normalizeDigitString(userId);
  const suffix = normalized.slice(-6).padStart(6, '0');

  return {
    avatarLetter: 'A',
    displayName: `app_${suffix}`
  };
}

export function getStandaloneUserIdPolicy() {
  return {
    length: APP_USER_ID_LENGTH,
    prefix: APP_USER_ID_PREFIX
  };
}

export function resolveInitialUserSession() {
  if (typeof window === 'undefined') {
    return { userId: '', source: 'none' };
  }

  const storedUserId = getStoredUserId();

  if (storedUserId) {
    return { userId: storedUserId, source: 'storage' };
  }

  return {
    source: 'generated',
    userId: createAndStoreStandaloneUserId()
  };
}
