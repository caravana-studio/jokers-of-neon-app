import i18n from "i18next";
import { CardDataMap } from "../types/CardData";
import { CARDS_RARITY } from "../constants/cardsRarity";

export const SPECIAL_CARDS_DATA: CardDataMap = {};

const CARDS_PRICE: Record<CARDS_RARITY, number> = {
  [CARDS_RARITY.C]: 1000,
  [CARDS_RARITY.B]: 1750,
  [CARDS_RARITY.A]: 3500,
  [CARDS_RARITY.S]: 5000,
  [CARDS_RARITY.SS]: 7000,
};

const createCardData = (
  id: number,
  rarity: CARDS_RARITY,
  ns: string = "effects"
) => ({
  name: i18n.t(`specialCardsData.${id}.name`, { ns }),
  description: i18n.t(`specialCardsData.${id}.description`, { ns }),
  rarity,
  price: CARDS_PRICE[rarity],
});

const loadTranslations = async () => {
  await i18n.loadNamespaces(["effects"]);

  Object.assign(SPECIAL_CARDS_DATA, {
    300: createCardData(300, CARDS_RARITY.C),
    301: createCardData(301, CARDS_RARITY.C),
    302: createCardData(302, CARDS_RARITY.C),
    303: createCardData(303, CARDS_RARITY.C),
    304: createCardData(304, CARDS_RARITY.C),
    305: createCardData(305, CARDS_RARITY.C),
    306: createCardData(306, CARDS_RARITY.B),
    307: createCardData(307, CARDS_RARITY.B),
    308: createCardData(308, CARDS_RARITY.B),
    309: createCardData(309, CARDS_RARITY.B),
    310: createCardData(310, CARDS_RARITY.S),
    311: createCardData(311, CARDS_RARITY.SS),
    312: createCardData(312, CARDS_RARITY.A),
    313: createCardData(313, CARDS_RARITY.B),
    314: createCardData(314, CARDS_RARITY.A),
    315: createCardData(315, CARDS_RARITY.A),
    316: createCardData(316, CARDS_RARITY.S),
    317: createCardData(317, CARDS_RARITY.A),
    318: createCardData(318, CARDS_RARITY.B),
    319: createCardData(319, CARDS_RARITY.S),
    320: createCardData(320, CARDS_RARITY.SS),
    321: createCardData(321, CARDS_RARITY.C),
    322: createCardData(322, CARDS_RARITY.A),
    323: createCardData(323, CARDS_RARITY.S),
    325: createCardData(325, CARDS_RARITY.A),
    331: createCardData(331, CARDS_RARITY.A),
    332: createCardData(332, CARDS_RARITY.B),
    334: createCardData(334, CARDS_RARITY.C),
    336: createCardData(336, CARDS_RARITY.B),
    337: createCardData(337, CARDS_RARITY.A),
    338: createCardData(338, CARDS_RARITY.A),
    341: createCardData(341, CARDS_RARITY.A),
    343: createCardData(343, CARDS_RARITY.A),
    344: createCardData(344, CARDS_RARITY.B),
    345: createCardData(345, CARDS_RARITY.A),
    346: createCardData(346, CARDS_RARITY.A),
    347: createCardData(347, CARDS_RARITY.B),
    348: createCardData(348, CARDS_RARITY.B),
    349: createCardData(349, CARDS_RARITY.B),
    350: createCardData(350, CARDS_RARITY.B),
  });
};

i18n.on("initialized", loadTranslations);
i18n.on("languageChanged", loadTranslations);
