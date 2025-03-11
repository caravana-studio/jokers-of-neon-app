import { RARITY } from "../constants/rarity";
import { CardDataMap } from "../types/CardData";
import i18n from 'i18next';

export const MODIFIER_CARDS_DATA: CardDataMap = {};
export const MODIFIERS_SUIT_CHANGING = [608, 609, 610, 611];

const CARDS_PRICE: Record<RARITY, number> = {
  [RARITY.B]: 300,
  [RARITY.A]: 750,
  [RARITY.S]: 1000,
  [RARITY.C]: 0,
  [RARITY.SS]: 0
};

const createCardData = (
  id: number,
  rarity: RARITY,
  ns: string = "effects"
) => ({
  name: i18n.t(`modifierCardsData.${id}.name`, { ns }),
  description: i18n.t(`modifierCardsData.${id}.description`, { ns }),
  rarity,
  price: CARDS_PRICE[rarity],
});

export const MODIFIERS_KEYS = {
  608: createCardData(608, RARITY.B),
  609: createCardData(609, RARITY.B),
  610: createCardData(610, RARITY.B),
  611: createCardData(611, RARITY.B),
  612: createCardData(612, RARITY.S),
  613: createCardData(613, RARITY.A),
}

const loadTranslations = async () => {
  await i18n.loadNamespaces(["effects"]);

  Object.assign(MODIFIER_CARDS_DATA, MODIFIERS_KEYS);
};

i18n.on('initialized', loadTranslations);
i18n.on('languageChanged', loadTranslations);