import { CardDataMap } from "../types/CardData";
import i18n from "i18next";

export const LOOT_BOXES_DATA: CardDataMap = {};

const loadTranslations = async () => {
  await i18n.loadNamespaces(["loot-boxes"]);

  Object.assign(LOOT_BOXES_DATA, {
    1: {
      name: i18n.t("lootBoxData.1.name", { ns: "loot-boxes" }),
      description: i18n.t("lootBoxData.1.description", { ns: "loot-boxes" }),
      details: i18n.t("lootBoxData.1.details", { ns: "loot-boxes" }),
    },
    2: {
      name: i18n.t("lootBoxData.2.name", { ns: "loot-boxes" }),
      description: i18n.t("lootBoxData.2.description", { ns: "loot-boxes" }),
      details: i18n.t("lootBoxData.2.details", { ns: "loot-boxes" }),
    },
    3: {
      name: i18n.t("lootBoxData.3.name", { ns: "loot-boxes" }),
      description: i18n.t("lootBoxData.3.description", { ns: "loot-boxes" }),
      details: i18n.t("lootBoxData.3.details", { ns: "loot-boxes" }),
    },
    4: {
      name: i18n.t("lootBoxData.4.name", { ns: "loot-boxes" }),
      description: i18n.t("lootBoxData.4.description", { ns: "loot-boxes" }),
      details: i18n.t("lootBoxData.4.details", { ns: "loot-boxes" }),
    },
    5: {
      name: i18n.t("lootBoxData.5.name", { ns: "loot-boxes" }),
      description: i18n.t("lootBoxData.5.description", { ns: "loot-boxes" }),
      details: i18n.t("lootBoxData.5.details", { ns: "loot-boxes" }),
    },
    6: {
      name: i18n.t("lootBoxData.6.name", { ns: "loot-boxes" }),
      description: i18n.t("lootBoxData.6.description", { ns: "loot-boxes" }),
      details: i18n.t("lootBoxData.6.details", { ns: "loot-boxes" }),
    },
    7: {
      name: i18n.t("lootBoxData.7.name", { ns: "loot-boxes" }),
      description: i18n.t("lootBoxData.7.description", { ns: "loot-boxes" }),
      details: i18n.t("lootBoxData.7.details", { ns: "loot-boxes" }),
    },
    8: {
      name: i18n.t("lootBoxData.8.name", { ns: "loot-boxes" }),
      description: i18n.t("lootBoxData.8.description", { ns: "loot-boxes" }),
      details: i18n.t("lootBoxData.8.details", { ns: "loot-boxes" }),
    },
    9: {
      name: i18n.t("lootBoxData.9.name", { ns: "loot-boxes" }),
      description: i18n.t("lootBoxData.9.description", { ns: "loot-boxes" }),
      details: i18n.t("lootBoxData.9.details", { ns: "loot-boxes" }),
    },
    10: {
      name: i18n.t("lootBoxData.10.name", { ns: "loot-boxes" }),
      description: i18n.t("lootBoxData.10.description", { ns: "loot-boxes" }),
      details: i18n.t("lootBoxData.10.details", { ns: "loot-boxes" }),
    },
  });
};

i18n.on("initialized", loadTranslations);
i18n.on("languageChanged", loadTranslations);
