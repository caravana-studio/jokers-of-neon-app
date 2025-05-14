import {
  createContext,
  ReactNode,
  useContext,
  useState
} from "react";
import { useTranslation } from "react-i18next";
import { BOXES_PRICE, BOXES_RARITY } from "../data/lootBoxes.ts";
import { MODIFIERS_PRICE, MODIFIERS_RARITY } from "../data/modifiers.ts";
import {
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
import { CardData } from "../types/CardData.ts";
import { RAGES_RARITY } from "../data/rageCards.ts";

interface CardDataContextType {
  getCardData: (id: number) => CardData;
  getLootBoxData: (id: number) => CardData;
  refetchSpecialCardsData: (modId: string, gameId: number) => {};
}

const CardDataContext = createContext<CardDataContextType | undefined>(
  undefined
);

interface CardDataProviderProps {
  children: ReactNode;
}

const animationFolder = "/spine-animations/";
const animationPrefix = "loot_box_";

export const CardDataProvider = ({ children }: CardDataProviderProps) => {
  const { t } = useTranslation("cards");
  const {
    setup: { client },
  } = useDojo();

  const [cumulativeCardsData, setCumulativeCardsData] = useState<
    Record<number, SpecialCardInfo>
  >({});

  const getLootBoxData = (id: number) => {
    const rarity = BOXES_RARITY[id].rarity;
    const price = BOXES_PRICE[rarity];
    const size = BOXES_RARITY[id].size;

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

  const getCardData = (cardId: number) => {
    const isTraditional = cardId < 100;
    const isNeon = cardId >= 200 && cardId < 300;
    const isRage = cardId > 400 && cardId < 500;
    const isSpecial = cardId >= 300 && cardId < 400;
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
      const cardData = cumulativeCardsData[cardId];
      return {
        name: t(`specials.${cardId}.name`),
        description: t(`specials.${cardId}.description`, {
          points: cardData?.points,
          multi: cardData?.multi,
          cash: cardData?.cash,
        }),
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

  const refetchSpecialCardsData = async (modId: string, gameId: number) => {
    const record: Record<number, SpecialCardInfo> = {};
    SPECIALS_CUMULATIVE.forEach(async (specialId) => {
      const cardInfo = await getSpecialCardInfo(
        client,
        modId,
        gameId ?? 0,
        specialId
      );
      record[specialId] = cardInfo;
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
