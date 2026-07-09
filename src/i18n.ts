import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";

const normalizeLanguage = (language: string) => {
  const normalized = language.toLowerCase();

  if (normalized.startsWith("es")) return "es";
  if (normalized.startsWith("pt")) return "pt";
  return "en";
};

const loadResources = async (language: string, namespace: string) => {
  if (namespace === "translation") {
    return {};
  }

  const normalizedLanguage = normalizeLanguage(language);
  const response = await fetch(
    `/locales/${normalizedLanguage}/${namespace}/translation.json`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load i18n resources for ${normalizedLanguage}/${namespace}`,
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
    supportedLngs: ["en", "es", "pt"],
    nonExplicitSupportedLngs: true,
    load: "languageOnly",
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
