import { RARITY } from "../constants/rarity";
import { CardDataMap } from "../types/CardData";
import i18n from "i18next";

export const LOOT_BOXES_DATA: CardDataMap = {};

const BOXES_PRICE: Record<RARITY, number> = {
  [RARITY.C]: 750,
  [RARITY.B]: 1500,
  [RARITY.A]: 2000,
  [RARITY.S]: 0,
  [RARITY.SS]: 0
};

const animationFolder = "/spine-animations/";
const animationPrefix = "loot_box_";

const loadLootBoxData = (id: number, size: number, rarity: RARITY) => ({
  name: i18n.t(`lootBoxData.${id}.name`, { ns: "loot-boxes" }),
  description: i18n.t(`lootBoxData.${id}.description`, { ns: "loot-boxes" }),
  details: i18n.t(`lootBoxData.${id}.details`, { ns: "loot-boxes" }),
  size,
  rarity: rarity,
  price: BOXES_PRICE[rarity],
  animation: {
    jsonUrl: `${animationFolder}${animationPrefix}${id}.json`,
    atlasUrl: `${animationFolder}${animationPrefix}${id}.atlas`
  }
});

const loadTranslations = async () => {
  await i18n.loadNamespaces(["loot-boxes"]);

  const lootBoxes = {
    1: loadLootBoxData(1, 5, RARITY.C),
    2: loadLootBoxData(2, 5, RARITY.B),
    3: loadLootBoxData(3, 3, RARITY.B),
    4: loadLootBoxData(4, 3, RARITY.A),
    5: loadLootBoxData(5, 5, RARITY.B),
    6: loadLootBoxData(6, 5, RARITY.C),
    7: loadLootBoxData(7, 4, RARITY.A),
    8: loadLootBoxData(8, 5, RARITY.C),
    9: loadLootBoxData(9, 3, RARITY.C),
    10: loadLootBoxData(10, 5, RARITY.A),
  };

  Object.assign(LOOT_BOXES_DATA, lootBoxes);
};

i18n.on("initialized", loadTranslations);
i18n.on("languageChanged", loadTranslations);
