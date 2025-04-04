import i18n from "i18next";
import { RARITY } from "../constants/rarity";
import { CardTypes } from "../enums/cardTypes";

export const SPECIAL_CARDS_BLOCKS_SUIT_CHANGE = [314];

const CARDS_PRICE: Record<RARITY, number> = {
  [RARITY.C]: 1000,
  [RARITY.B]: 1750,
  [RARITY.A]: 3500,
  [RARITY.S]: 5000,
  [RARITY.SS]: 7000,
};

/* const url = import.meta.env.VITE_MOD_URL + `${modId}/resources/specials.json`;
  try {
    console.log("fetching specials.json");
    const content = await getJsonFromUrl(url);
  } catch (error) {
    console.error("Error fetching specials.json:", error);
  }
 */
const ns = "effects";

export const getSpecialCardData = (id: number) => {
  const rarity = SPECIALS_KEYS[id];
  const price = CARDS_PRICE[rarity];
  return {
    name: i18n.t(`specialCardsData.${id}.name`, { ns }),
    description: i18n.t(`specialCardsData.${id}.description`, { ns }),
    rarity,
    price,
    temporaryPrice: Math.round(price / 3 / 100) * 100,
    type: CardTypes.SPECIAL,
  };
};

export const SPECIALS_KEYS: Record<number, RARITY> = {
  300: RARITY.C,
  301: RARITY.C,
  302: RARITY.C,
  303: RARITY.C,
  304: RARITY.C,
  305: RARITY.C,
  306: RARITY.B,
  307: RARITY.B,
  308: RARITY.B,
  309: RARITY.B,
  310: RARITY.S,
  311: RARITY.SS,
  312: RARITY.A,
  313: RARITY.B,
  314: RARITY.A,
  315: RARITY.A,
  316: RARITY.S,
  317: RARITY.A,
  318: RARITY.B,
  319: RARITY.S,
  320: RARITY.SS,
  321: RARITY.C,
  322: RARITY.A,
  323: RARITY.S,
  325: RARITY.A,
  331: RARITY.A,
  332: RARITY.B,
  334: RARITY.C,
  336: RARITY.B,
  337: RARITY.A,
  338: RARITY.A,
  341: RARITY.A,
  343: RARITY.A,
  344: RARITY.B,
  345: RARITY.A,
  346: RARITY.A,
  347: RARITY.B,
  348: RARITY.B,
  349: RARITY.B,
  350: RARITY.B,
  357: RARITY.B,
};
