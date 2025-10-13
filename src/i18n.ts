import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import achievementsEn from "../public/locales/en/achievements/translation.json";
import cardsEn from "../public/locales/en/cards/translation.json";
import docsEn from "../public/locales/en/docs/translation.json";
import gameEn from "../public/locales/en/game/translation.json";
import homeEn from "../public/locales/en/home/translation.json";
import intermediteEn from "../public/locales/en/intermediate-screens/translation.json";
import mapEn from "../public/locales/en/map/translation.json";
import playsEn from "../public/locales/en/plays/translation.json";
import storeEn from "../public/locales/en/store/translation.json";
import tutorialEn from "../public/locales/en/tutorials/translation.json";

import achievementsEs from "../public/locales/es/achievements/translation.json";
import cardsEs from "../public/locales/es/cards/translation.json";
import docsEs from "../public/locales/es/docs/translation.json";
import gameEs from "../public/locales/es/game/translation.json";
import homeEs from "../public/locales/es/home/translation.json";
import intermediteEs from "../public/locales/es/intermediate-screens/translation.json";
import mapEs from "../public/locales/es/map/translation.json";
import playsEs from "../public/locales/es/plays/translation.json";
import storeEs from "../public/locales/es/store/translation.json";
import tutorialEs from "../public/locales/es/tutorials/translation.json";

import achievementsPt from "../public/locales/pt/achievements/translation.json";
import cardsPt from "../public/locales/pt/cards/translation.json";
import docsPt from "../public/locales/pt/docs/translation.json";
import gamePt from "../public/locales/pt/game/translation.json";
import homePt from "../public/locales/pt/home/translation.json";
import intermeditePt from "../public/locales/pt/intermediate-screens/translation.json";
import mapPt from "../public/locales/pt/map/translation.json";
import playsPt from "../public/locales/pt/plays/translation.json";
import storePt from "../public/locales/pt/store/translation.json";
import tutorialPt from "../public/locales/pt/tutorials/translation.json";

const resources = {
  en: {
    achievements: achievementsEn,
    cards: cardsEn,
    docs: docsEn,
    game: gameEn,
    home: homeEn,
    "intermediate-screens": intermediteEn,
    map: mapEn,
    plays: playsEn,
    store: storeEn,
    tutorials: tutorialEn,
  },
  es: {
    achievements: achievementsEs,
    cards: cardsEs,
    docs: docsEs,
    game: gameEs,
    home: homeEs,
    "intermediate-screens": intermediteEs,
    map: mapEs,
    plays: playsEs,
    store: storeEs,
    tutorials: tutorialEs,
  },
  pt: {
    achievements: achievementsPt,
    cards: cardsPt,
    docs: docsPt,
    game: gamePt,
    home: homePt,
    "intermediate-screens": intermeditePt,
    map: mapPt,
    plays: playsPt,
    store: storePt,
    tutorials: tutorialPt,
  },
};

i18n
  .use(LanguageDetector) // Detect the user's language
  .use(initReactI18next) // Bind i18next to React
  .init({
    resources,
    fallbackLng: "en",
    debug: false,
    interpolation: {
      escapeValue: false, // React already escapes values to prevent XSS, so disable escaping
    },
    react: {
      useSuspense: false, // Disable React suspense for smoother integration
    },
  })
  .catch((error: Error) =>
    console.error("i18next initialization error:", error)
  );

export default i18n;
