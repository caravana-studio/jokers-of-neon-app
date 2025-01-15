import { CARDS_RARITY } from "../constants/cardsRarity";
import { CardDataMap } from "../types/CardData";
import i18n from 'i18next';

export const MODIFIER_CARDS_DATA: CardDataMap = {};

const CARDS_PRICE: Record<CARDS_RARITY, number> = {
  [CARDS_RARITY.B]: 300,
  [CARDS_RARITY.A]: 750,
  [CARDS_RARITY.S]: 1000,
  [CARDS_RARITY.C]: 0,
  [CARDS_RARITY.SS]: 0
};

const createCardData = (
  id: number,
  rarity: CARDS_RARITY,
  ns: string = "effects"
) => ({
  name: i18n.t(`modifierCardsData.${id}.name`, { ns }),
  description: i18n.t(`modifierCardsData.${id}.description`, { ns }),
  rarity,
  price: CARDS_PRICE[rarity],
});

const loadTranslations = async () => {
  await i18n.loadNamespaces(["effects"]);

  Object.assign(MODIFIER_CARDS_DATA, {
    608: createCardData(608, CARDS_RARITY.B),
    609: createCardData(609, CARDS_RARITY.B),
    610: createCardData(610, CARDS_RARITY.B),
    611: createCardData(611, CARDS_RARITY.B),
    612: createCardData(612, CARDS_RARITY.S),
    613: createCardData(613, CARDS_RARITY.A),
  });
};

i18n.on('initialized', loadTranslations);
i18n.on('languageChanged', loadTranslations);