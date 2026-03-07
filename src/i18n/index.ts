import { createI18n } from 'vue-i18n';

import en from './en';
import zhCN from './zh-CN';

export const locales = [
  { value: 'en', label: 'English' },
  { value: 'zh-CN', label: '简体中文' },
];

const browserLang = navigator.language;
const locale = browserLang.startsWith('zh') ? 'zh-CN' : 'en';

const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'en',
  messages: {
    en,
    'zh-CN': zhCN,
  },
});

export default i18n;
