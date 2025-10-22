import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";

const loadResources = (language: string, namespace: string) =>
  import(`../public/locales/${language}/${namespace}/translation.json`);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(resourcesToBackend(loadResources))
  .init({
    fallbackLng: "en",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })
  .catch((error: Error) =>
    console.error("i18next initialization error:", error)
  );

export default i18n;
