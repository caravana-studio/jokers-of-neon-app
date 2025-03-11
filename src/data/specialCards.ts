import i18n from "i18next";
import { CardDataMap } from "../types/CardData";
import { RARITY } from "../constants/rarity";
import { getJsonFromUrl } from "../utils/loadJsonFromUrl";

export const SPECIAL_CARDS_DATA: CardDataMap = {};
export const SPECIAL_CARDS_BLOCKS_SUIT_CHANGE = [314];

const CARDS_PRICE: Record<RARITY, number> = {
  [RARITY.C]: 1000,
  [RARITY.B]: 1750,
  [RARITY.A]: 3500,
  [RARITY.S]: 5000,
  [RARITY.SS]: 7000,
};

const createCardData = (
  id: number,
  rarity: RARITY,
  ns: string = "effects"
) => ({
  name: i18n.t(`specialCardsData.${id}.name`, { ns }),
  description: i18n.t(`specialCardsData.${id}.description`, { ns }),
  rarity,
  price: CARDS_PRICE[rarity],
  temporaryPrice: Math.round((CARDS_PRICE[rarity] / 3) / 100) * 100,
});

export const SPECIALS_KEYS = {
  300: createCardData(300, RARITY.C),
  301: createCardData(301, RARITY.C),
  302: createCardData(302, RARITY.C),
  303: createCardData(303, RARITY.C),
  304: createCardData(304, RARITY.C),
  305: createCardData(305, RARITY.C),
  306: createCardData(306, RARITY.B),
  307: createCardData(307, RARITY.B),
  308: createCardData(308, RARITY.B),
  309: createCardData(309, RARITY.B),
  310: createCardData(310, RARITY.S),
  311: createCardData(311, RARITY.SS),
  312: createCardData(312, RARITY.A),
  313: createCardData(313, RARITY.B),
  314: createCardData(314, RARITY.A),
  315: createCardData(315, RARITY.A),
  316: createCardData(316, RARITY.S),
  317: createCardData(317, RARITY.A),
  318: createCardData(318, RARITY.B),
  319: createCardData(319, RARITY.S),
  320: createCardData(320, RARITY.SS),
  321: createCardData(321, RARITY.C),
  322: createCardData(322, RARITY.A),
  323: createCardData(323, RARITY.S),
  325: createCardData(325, RARITY.A),
  331: createCardData(331, RARITY.A),
  332: createCardData(332, RARITY.B),
  334: createCardData(334, RARITY.C),
  336: createCardData(336, RARITY.B),
  337: createCardData(337, RARITY.A),
  338: createCardData(338, RARITY.A),
  341: createCardData(341, RARITY.A),
  343: createCardData(343, RARITY.A),
  344: createCardData(344, RARITY.B),
  345: createCardData(345, RARITY.A),
  346: createCardData(346, RARITY.A),
  347: createCardData(347, RARITY.B),
  348: createCardData(348, RARITY.B),
  349: createCardData(349, RARITY.B),
  350: createCardData(350, RARITY.B),
}

const loadTranslations = async () => {
  await i18n.loadNamespaces(["effects"]);

  Object.assign(SPECIAL_CARDS_DATA, SPECIALS_KEYS);
};

export const fetchAndMergeSpecialCardsData = async (modId: string) => {
  const url = import.meta.env.VITE_MOD_URL + `${modId}/resources/specials.json`;
  try {
    const content = await getJsonFromUrl(url);
    Object.assign(SPECIAL_CARDS_DATA, content);
  } catch (error) {
    console.error("Error fetching specials.json:", error);
  }
};

i18n.on("initialized", loadTranslations);
i18n.on("languageChanged", loadTranslations);
