import { createContext, ReactNode, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { MODIFIERS_PRICE, MODIFIERS_RARITY } from "../data/modifiers.ts";
import { SPECIALS_PRICE, SPECIALS_RARITY } from "../data/specialCards.ts";
import { CARDS_SUIT_DATA } from "../data/traditionalCards.ts";
import { SpecialCardInfo } from "../dojo/queries/getSpecialCardInfo.ts";
import { CardTypes } from "../enums/cardTypes.ts";
import { CardData } from "../types/CardData.ts";

interface CardDataContextType {
  getCardData: (id: number) => CardData;
  refetchSpecialCardsData: () => {};
}

const CardDataContext = createContext<CardDataContextType | undefined>(
  undefined
);

interface CardDataProviderProps {
  children: ReactNode;
}

export const CardDataProvider = ({ children }: CardDataProviderProps) => {
  const { t } = useTranslation("cards");

  const [cumulativeCardsData, setCumulativeCardsData] = useState<
    Record<number, SpecialCardInfo>
  >({});

  const getCardData = (cardId: number) => {
    const isTraditional = cardId < 100;
    const isNeon = cardId >= 200 && cardId < 300;
    const isRage = cardId > 400 && cardId < 500;
    const isSpecial = cardId >= 300 && cardId < 400;
    const isModifier = cardId >= 600 && cardId < 700;

    if (isRage) {
      return {
        name: t(`rageCards.${cardId}.name`),
        description: t(`rageCards.${cardId}.description`),
        type: CardTypes.RAGE,
      };
    } else if (isSpecial) {
      const rarity = SPECIALS_RARITY[cardId];
      const price = SPECIALS_PRICE[rarity];
      return {
        name: t(`specials.${cardId}.name`),
        description: t(`specials.${cardId}.description`),
        rarity,
        price,
        type: CardTypes.SPECIAL,
      };
    } else if (isModifier) {
      const rarity = MODIFIERS_RARITY[cardId];
      const price = MODIFIERS_PRICE[rarity];
      return {
        name: t(`modifiers.${cardId}.name`),
        description: t(`modifiers.${cardId}.description`),
        rarity,
        price,
        type: CardTypes.MODIFIER,
      };
    } else if (isTraditional) {
      return {
        name: t(`traditionalCards.${cardId}.name`),
        description: t(`traditionalCards.${cardId}.description`),
        card: CARDS_SUIT_DATA[cardId].card,
        suit: CARDS_SUIT_DATA[cardId].suit,
        type: CardTypes.COMMON,
      };
    } else if (isNeon) {
      return {
        name: t(`neonCards.${cardId}.name`),
        description: t(`neonCards.${cardId}.description`),
        card: CARDS_SUIT_DATA[cardId].card,
        suit: CARDS_SUIT_DATA[cardId].suit,
        type: CardTypes.NEON,
      };
    } else {
      return {
        name: "",
        description: "",
        type: CardTypes.NONE,
      };
    }
  };

  const refetchSpecialCardsData = () => {
    return
  };

  return (
    <CardDataContext.Provider
      value={{
        getCardData,
        refetchSpecialCardsData,
      }}
    >
      {children}
    </CardDataContext.Provider>
  );
};

export const useCardData = () => {
  const context = useContext(CardDataContext);
  if (!context) {
    throw new Error("useCardData must be used within a CardDataProvider");
  }
  return context;
};
