import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";

const loadResources = async (language: string, namespace: string) => {
  const response = await fetch(
    `/locales/${language}/${namespace}/translation.json`
  );

  if (!response.ok) {
    throw new Error(
      `Could not load translations for ${language}/${namespace}: ${response.status}`
    );
  }

  return response.json();
};

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
