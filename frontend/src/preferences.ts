import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

export type InterfaceLanguage = 'en' | 'ur' | 'hi' | 'ar';

export function usePersistentState<T>(
  key: string,
  initialValue: T,
  isValid: (value: unknown) => value is T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored === null) return initialValue;
      const parsed: unknown = JSON.parse(stored);
      return isValid(parsed) ? parsed : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Unable to save preference "${key}".`, error);
    }
  }, [key, value]);

  return [value, setValue];
}

export const isInterfaceLanguage = (value: unknown): value is InterfaceLanguage =>
  value === 'en' || value === 'ur' || value === 'hi' || value === 'ar';

export const isTheme = (value: unknown): value is 'light' | 'dark' | 'sepia' =>
  value === 'light' || value === 'dark' || value === 'sepia';

export const isTranslation = (value: unknown): value is string =>
  typeof value === 'string' && [
    'en.saheeh',
    'ur.maududi.api',
    'hi.azizul',
    'hinglish.paraphrase',
    'bn.taisirul',
    'fr.hamidullah',
    'id.ministry',
  ].includes(value);

export const isFontSize = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 22 && value <= 44;

export const isSurahId = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 114;

export const isNavSection = (value: unknown): value is any =>
  typeof value === 'string' && [
    'home',
    'reader',
    'companion',
    'maktabah',
    'research',
    'library',
    'calendar',
    'tafsir',
    'search',
    'linguistics',
    'hadith',
    'academy',
    'hifz',
    'notebook',
    'bookmarks',
    'history',
    'admin',
  ].includes(value);
