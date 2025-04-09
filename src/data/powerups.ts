import i18n from "i18next";

const ns = "cards";

export const POWER_UP_KEYS = [800, 801, 802, 803, 804, 805, 806, 807];

export const getPowerUpData = (id: number) => {
  return {
    name: i18n.t(`powerUpsData.${id}.name`, { ns }),
    description: i18n.t(`powerUpsData.${id}.description`, { ns }),
  };
};
