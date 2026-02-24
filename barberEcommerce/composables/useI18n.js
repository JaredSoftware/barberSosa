import es from '~/locales/es.json';
import en from '~/locales/en.json';

// Composable temporal para i18n hasta que se instale @nuxtjs/i18n
export const useI18n = () => {
  const supportedLocales = ['es', 'en'];
  const locale = useState('i18n-locale', () => {
    if (process.client) {
      const cookie = document.cookie.split('; ').find(row => row.startsWith('i18n_redirected='));
      const cookieLocale = cookie ? cookie.split('=')[1] : 'es';
      return supportedLocales.includes(cookieLocale) ? cookieLocale : 'es';
    }
    return 'es';
  });
  
  const getTranslations = () => {
    return locale.value === 'en' ? en : es;
  };
  
  const t = (key, fallback, params) => {
    const keys = key.split('.');
    const translations = getTranslations();
    let value = translations;

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined || value === null) {
        return fallback ?? key;
      }
    }

    if (params && typeof value === 'string') {
      Object.keys(params).forEach((paramKey) => {
        value = value.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), params[paramKey]);
      });
    }
    return value;
  };
  
  const setLocale = (newLocale) => {
    if (!supportedLocales.includes(newLocale)) return;
    locale.value = newLocale;
    if (process.client) {
      document.cookie = `i18n_redirected=${newLocale}; path=/; max-age=31536000`;
    }
  };
  
  return {
    locale: readonly(locale),
    t,
    setLocale
  };
};
