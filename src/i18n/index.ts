import { createI18n } from 'vue-i18n';

import en from './en';
import zhCN from './zh-CN';

export const locales = [
  { value: 'en', label: 'English' },
  { value: 'zh-CN', label: '简体中文' },
];

const LOCALE_STORAGE_KEY = 'locale';

export function detectLocale(): string {
  const browserLang = navigator.language;
  return browserLang.startsWith('zh') ? 'zh-CN' : 'en';
}

function resolveLocale(): string {
  const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (saved && locales.some((l) => l.value === saved)) {
    return saved;
  }
  return detectLocale();
}

export function saveLocalePreference(locale: string): void {
  if (locale === detectLocale()) {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
  } else {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }
}

const i18n = createI18n({
  legacy: false,
  locale: resolveLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    'zh-CN': zhCN,
  },
});

export default i18n;
