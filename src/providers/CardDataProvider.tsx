import { createContext, ReactNode, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { BOXES_PRICE, BOXES_RARITY } from "../data/lootBoxes.ts";
import { MODIFIERS_PRICE, MODIFIERS_RARITY } from "../data/modifiers.ts";
import { RAGES_RARITY } from "../data/rageCards.ts";
import {
  SPECIALS_CREATORS,
  SPECIALS_CUMULATIVE,
  SPECIALS_PRICE,
  SPECIALS_RARITY,
} from "../data/specialCards.ts";
import { CARDS_SUIT_DATA } from "../data/traditionalCards.ts";
import {
  getSpecialCardInfo,
  SpecialCardInfo,
} from "../dojo/queries/getSpecialCardInfo.ts";
import { useDojo } from "../dojo/useDojo.tsx";
import { CardTypes } from "../enums/cardTypes.ts";
import { Card } from "../types/Card.ts";
import { CardData } from "../types/CardData.ts";

interface CardDataContextType {
  getCardData: (id: number, options?: GetCardDataOptions) => CardData;
  getLootBoxData: (id: number) => CardData;
  refetchSpecialCardsData: (
    modId: string,
    gameId: number,
    specialCards: Card[]
  ) => {};
}

interface GetCardDataOptions {
  showCumulativeProgress?: boolean;
}

const CardDataContext = createContext<CardDataContextType | undefined>(
  undefined
);

interface CardDataProviderProps {
  children: ReactNode;
}

const animationFolder = "/spine-animations/";
const animationPrefix = "loot_box_";
const CUMULATIVE_PROGRESS_SUFFIX_REGEX =
  /\s+(?:Currently(?:\s+at)?|Actualmente|Atualmente)\b[\s\S]*$/i;

const stripCumulativeProgressSuffix = (description: string) =>
  description.replace(CUMULATIVE_PROGRESS_SUFFIX_REGEX, "").trimEnd();

export const CardDataProvider = ({ children }: CardDataProviderProps) => {
  const { t } = useTranslation("cards");
  const {
    setup: { client },
  } = useDojo();

  const [cumulativeCardsData, setCumulativeCardsData] = useState<
    Record<number, SpecialCardInfo>
  >({});

  const getLootBoxData = (id: number) => {
    const boxData = BOXES_RARITY[id];
    if (!boxData) {
      console.warn(`[CardDataProvider] Missing loot box data for id ${id}`);
      return {
        name: t(`lootBoxes.${id}.name`, { defaultValue: "Loot box" }),
        description: t(`lootBoxes.${id}.description`, {
          defaultValue: "Unknown loot box",
        }),
        details: t(`lootBoxes.${id}.details`, { defaultValue: "" }),
        type: CardTypes.PACK,
        animation: {
          jsonUrl: `${animationFolder}${animationPrefix}${id}.json`,
          atlasUrl: `${animationFolder}${animationPrefix}${id}.atlas`,
        },
      };
    }

    const rarity = boxData.rarity;
    const price = BOXES_PRICE[rarity];
    const size = boxData.size;

    return {
      name: t(`lootBoxes.${id}.name`),
      description: t(`lootBoxes.${id}.description`),
      details: t(`lootBoxes.${id}.details`),
      rarity,
      price,
      size,
      type: CardTypes.PACK,
      animation: {
        jsonUrl: `${animationFolder}${animationPrefix}${id}.json`,
        atlasUrl: `${animationFolder}${animationPrefix}${id}.atlas`,
      },
    };
  };

  const getCardData = (cardId: number, options?: GetCardDataOptions) => {
    const isTraditional = cardId < 100;
    const isNeon = cardId >= 200 && cardId < 300;
    const isRage = cardId >= 20000 && cardId < 30000;
    const isSpecial = cardId >= 10000 && cardId < 20000;
    const isModifier = cardId >= 600 && cardId < 700;

    if (isRage) {
      const rarity = RAGES_RARITY[cardId];
      return {
        name: t(`rageCards.${cardId}.name`),
        description: t(`rageCards.${cardId}.description`),
        type: CardTypes.RAGE,
        rarity,
      };
    } else if (isSpecial) {
      const rarity = SPECIALS_RARITY[cardId];
      const price = SPECIALS_PRICE[rarity];
      const creator = SPECIALS_CREATORS[cardId];
      const cardData = cumulativeCardsData[cardId];
      const isCumulative = SPECIALS_CUMULATIVE.includes(cardId);
      const showCumulativeProgress = options?.showCumulativeProgress ?? false;
      const description = t(`specials.${cardId}.description`, {
        points: cardData?.points,
        multi: cardData?.multi,
        cash: cardData?.cash,
      });
      return {
        name: t(`specials.${cardId}.name`),
        description:
          isCumulative && !showCumulativeProgress
            ? stripCumulativeProgressSuffix(description)
            : description,
        rarity,
        price,
        type: CardTypes.SPECIAL,
        creator,
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

  const refetchSpecialCardsData = async (
    modId: string,
    gameId: number,
    specialCards: Card[]
  ) => {
    const record: Record<number, SpecialCardInfo> = {};
    const mySpecialCardIds = specialCards.map((card) => card.card_id);
    SPECIALS_CUMULATIVE.forEach(async (specialId) => {
      if (mySpecialCardIds.includes(specialId)) {
        const cardInfo = await getSpecialCardInfo(
          client,
          modId,
          gameId ?? 0,
          specialId
        );
        record[specialId] = cardInfo;
      }
    });
    setCumulativeCardsData(record);
  };

  return (
    <CardDataContext.Provider
      value={{
        getCardData,
        refetchSpecialCardsData,
        getLootBoxData,
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
