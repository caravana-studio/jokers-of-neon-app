import { CardDataMap } from "../types/CardData";
import i18n from "i18next";

export const LOOT_BOXES_DATA: CardDataMap = {};

const animationFolder = "/spine-animations/";
const animationPrefix = "loot_box_";

const loadLootBoxData = (id: number, size: number) => ({
  name: i18n.t(`lootBoxData.${id}.name`, { ns: "loot-boxes" }),
  description: i18n.t(`lootBoxData.${id}.description`, { ns: "loot-boxes" }),
  details: i18n.t(`lootBoxData.${id}.details`, { ns: "loot-boxes" }),
  size,
  animation: {
    jsonUrl: `${animationFolder}${animationPrefix}${id}.json`,
    atlasUrl: `${animationFolder}${animationPrefix}${id}.atlas`
  }
});

const loadTranslations = async () => {
  await i18n.loadNamespaces(["loot-boxes"]);

  const lootBoxes = {
    1: loadLootBoxData(1, 5),
    2: loadLootBoxData(2, 5),
    3: loadLootBoxData(3, 3),
    4: loadLootBoxData(4, 3),
    5: loadLootBoxData(5, 5),
    6: loadLootBoxData(6, 5),
    7: loadLootBoxData(7, 4),
    8: loadLootBoxData(8, 5),
    9: loadLootBoxData(9, 3),
    10: loadLootBoxData(10, 5),
  };

  Object.assign(LOOT_BOXES_DATA, lootBoxes);
};

i18n.on("initialized", loadTranslations);
i18n.on("languageChanged", loadTranslations);
