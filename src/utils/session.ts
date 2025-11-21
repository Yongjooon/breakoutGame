// utils/session.ts
export const USER_INDEX_KEY = 'userIndex';

export function setUserIndex(index: number) {
  sessionStorage.setItem(USER_INDEX_KEY, String(index));
}

export function getUserIndex(): number | null {
  const value = sessionStorage.getItem(USER_INDEX_KEY);
  if (value == null) return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
}

export function clearUserIndex() {
  sessionStorage.removeItem(USER_INDEX_KEY);
}
