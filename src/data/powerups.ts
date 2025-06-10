import i18n from "i18next";

const ns = "cards";

export const POWER_UP_KEYS = [800, 801, 802, 803, 804, 805, 806, 807];

const POWER_UP_COSTS = {
  B: 100,
  A: 200,
  S: 350,
  SS: 500,
} as const;

const B_POWER_UPS = [800, 804];
const A_POWER_UPS = [801, 805];
const S_POWER_UPS = [802, 806];
const SS_POWER_UPS = [803, 807];

type PowerUpCategory = keyof typeof POWER_UP_COSTS;

function getPowerUpCategoryById(id: number): PowerUpCategory | null {
  if (B_POWER_UPS.includes(id)) return "B";
  if (A_POWER_UPS.includes(id)) return "A";
  if (S_POWER_UPS.includes(id)) return "S";
  if (SS_POWER_UPS.includes(id)) return "SS";
  return null;
}

function getSellingPrice(id: number): number {
  const category = getPowerUpCategoryById(id ?? -1);
  const price = category ? POWER_UP_COSTS[category] : 0;

  return Math.round(price * 0.3 / 50) * 50;
}

export const getPowerUpData = (id: number) => {
  return {
    name: i18n.t(`power-ups.${id}.name`, { ns }),
    description: i18n.t(`power-ups.${id}.description`, { ns }),
    selling_price: getSellingPrice(id),
  };
};

