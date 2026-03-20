import { useTranslation } from "react-i18next";

function sectionForId(cardId: number): string | null {
  if (cardId < 100) return "traditionalCards";
  if (cardId >= 200 && cardId < 300) return "neonCards";
  if (cardId >= 600 && cardId < 700) return "modifiers";
  if (cardId >= 10000 && cardId < 20000) return "specials";
  if (cardId >= 20000 && cardId < 30000) return "rageCards";
  return null;
}

/** Returns the translated card name, falling back to `fallback` if not found. */
export function useCardName(cardId: number | undefined, fallback: string): string {
  const { t } = useTranslation("cards");
  if (cardId === undefined) return fallback;
  const section = sectionForId(cardId);
  if (!section) return fallback;
  return t(`${section}.${cardId}.name`, { defaultValue: fallback });
}
