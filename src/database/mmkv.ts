import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({ id: 'rdd-summary-storage' });

export function getJson<T>(key: string, fallback: T): T {
  const raw = storage.getString(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setJson<T>(key: string, value: T) {
  storage.set(key, JSON.stringify(value));
}
