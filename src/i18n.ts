import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Initialize i18n with TypeScript support
i18n
  .use(Backend) // Load translations from the server
  .use(LanguageDetector) // Detect the user's language
  .use(initReactI18next) // Bind i18next to React
  .init({
    fallbackLng: 'en', // Fallback language if the user's language cannot be detected
    debug: true, // Enable debug mode for development
    interpolation: {
      escapeValue: false, // React already escapes values to prevent XSS, so disable escaping
    },
    backend: {
      loadPath: function(lngs: string[], namespaces: string[] ) {
        // Return an array of paths, allowing the loading of multiple files in folder structure
        return namespaces.map(ns => `/locales/${lngs}/${ns}/translation.json`);
      }
    },
    react: {
      useSuspense: false, // Disable React suspense for smoother integration
    },
  })
  .catch((error: Error) => console.error('i18next initialization error:', error));

export default i18n;
