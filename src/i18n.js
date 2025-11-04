import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import enTranslations from '../public/locales/en/translation.json';
import frTranslations from '../public/locales/fr/translation.json';

i18n
  .use(HttpBackend) // Load translations from JSON files (fallback to local files)
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Bind with React
  .init({
    resources: {
      en: { translation: enTranslations },
      fr: { translation: frTranslations },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr'],
    detection: {
      order: ['localStorage', 'navigator'],
    },
    interpolation: {
      escapeValue: false, // React already protects from XSS
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // Path to load translations from
    },
  });

export default i18n;
