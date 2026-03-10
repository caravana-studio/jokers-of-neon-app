import { BOXES_PRICE, BOXES_RARITY } from "../../data/lootBoxes";
import { MODIFIERS_PRICE, MODIFIERS_RARITY } from "../../data/modifiers";
import { SPECIALS_PRICE, SPECIALS_RARITY } from "../../data/specialCards";
import { POWER_UP_KEYS } from "../../data/powerups";
import { RARITY } from "../../constants/rarity";
import { BlisterPackItem, BurnItem, SlotSpecialCardsItem } from "../../dojo/typescript/models.gen";
import { UnlockableSystem } from "../../domain/roguelike/types";
import { Card } from "../../types/Card";
import { PokerHandItem } from "../../types/PokerHandItem";
import { PowerUp } from "../../types/Powerup/PowerUp";
import { MOCKED_PLAYS } from "../../utils/mocks/tutorialMocks";
import {
  getAllowedModifierRarities,
  getMockShopItemCounts,
  isBurnUnlocked,
} from "./mockShopRules";

interface BuildMockDynamicStoreParams {
  gameId: number;
  runId: string;
  shopId: number;
  rerollCount: number;
  unlockedSystems: UnlockableSystem[];
}

interface MockDynamicStorePayload {
  commonCards: Card[];
  modifierCards: Card[];
  specialCards: Card[];
  pokerHandItems: PokerHandItem[];
  packs: BlisterPackItem[];
  specialSlotItem: SlotSpecialCardsItem;
  burnItem: BurnItem | null;
  powerUps: PowerUp[];
}

const DEFAULT_SHOP_ID = 1;
const DEFAULT_COMMON_CARD_PRICE = 120;
const DEFAULT_POKER_HAND_PRICE = 250;
const DEFAULT_SPECIAL_SLOT_COST = 1200;
const DEFAULT_BURN_COST = 500;

const COMMON_CARD_IDS = Array.from({ length: 53 }, (_, index) => index);
const MODIFIER_IDS = Object.keys(MODIFIERS_RARITY)
  .map((value) => Number(value))
  .filter((value) => Number.isFinite(value));
const SPECIAL_IDS = Object.keys(SPECIALS_RARITY)
  .map((value) => Number(value))
  .filter((value) => Number.isFinite(value));
const PACK_IDS = Object.keys(BOXES_RARITY)
  .map((value) => Number(value))
  .filter((value) => Number.isFinite(value));

const POWER_UP_COST_BY_ID: Record<number, number> = {
  800: 100,
  804: 100,
  801: 200,
  805: 200,
  802: 350,
  806: 350,
  803: 500,
  807: 500,
};

const rerollCountByShopKey = new Map<string, number>();

const getShopKey = (runId: string, shopId: number) => `${runId}:${shopId}`;

const hashString = (value: string): number => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
};

const pickDeterministic = <T>(pool: T[], count: number, seed: number): T[] => {
  if (count <= 0 || pool.length === 0) {
    return [];
  }

  const picked: T[] = [];
  const usedIndexes = new Set<number>();
  let current = seed % pool.length;
  let step = (seed % Math.max(1, pool.length - 1)) + 1;

  if (step % pool.length === 0) {
    step = 1;
  }

  while (picked.length < count) {
    if (!usedIndexes.has(current)) {
      picked.push(pool[current]);
      usedIndexes.add(current);
    }

    current = (current + step) % pool.length;
    if (usedIndexes.size >= pool.length) {
      break;
    }
  }

  return picked;
};

const getModifierPrice = (modifierId: number): number => {
  const rarity = MODIFIERS_RARITY[modifierId];
  return rarity ? MODIFIERS_PRICE[rarity] : DEFAULT_COMMON_CARD_PRICE;
};

const getSpecialPrice = (specialId: number): number => {
  const rarity = SPECIALS_RARITY[specialId];
  return rarity ? SPECIALS_PRICE[rarity] : DEFAULT_SPECIAL_SLOT_COST;
};

const getLootBoxPrice = (packId: number): number => {
  const rarity = BOXES_RARITY[packId]?.rarity ?? RARITY.C;
  return BOXES_PRICE[rarity];
};

const buildCard = (
  cardId: number,
  idx: number,
  price: number,
  flags?: Pick<
    Card,
    | "isModifier"
    | "isSpecial"
    | "temporary"
    | "temporary_price"
    | "temporary_discount_cost"
  >
): Card => ({
  id: `${idx}`,
  idx,
  img: `${cardId}.png`,
  card_id: cardId,
  price,
  purchased: false,
  discount_cost: 0,
  ...flags,
});

const buildMockDynamicStorePayload = ({
  gameId,
  runId,
  shopId,
  rerollCount,
  unlockedSystems,
}: BuildMockDynamicStoreParams): MockDynamicStorePayload => {
  const counts = getMockShopItemCounts(
    shopId > 0 ? shopId : DEFAULT_SHOP_ID,
    unlockedSystems
  );
  const allowedModifierRarities = new Set(
    getAllowedModifierRarities(unlockedSystems)
  );
  const availableModifierIds = MODIFIER_IDS.filter((modifierId) =>
    allowedModifierRarities.has(MODIFIERS_RARITY[modifierId])
  );
  const burnUnlocked = isBurnUnlocked(unlockedSystems);
  const seed = hashString(`${runId}:${shopId}:${rerollCount}`);

  const commonCards = pickDeterministic(
    COMMON_CARD_IDS,
    counts.traditionals ?? 0,
    seed + 11
  ).map((cardId, index) => buildCard(cardId, 1000 + index, DEFAULT_COMMON_CARD_PRICE));

  const modifierCards = pickDeterministic(
    availableModifierIds,
    counts.modifiers ?? 0,
    seed + 31
  ).map((cardId, index) =>
    buildCard(cardId, 2000 + index, getModifierPrice(cardId), {
      isModifier: true,
    })
  );

  const specialCards = pickDeterministic(
    SPECIAL_IDS,
    counts.specials ?? 0,
    seed + 53
  ).map((cardId, index) =>
    buildCard(cardId, 3000 + index, getSpecialPrice(cardId), {
      isSpecial: true,
      temporary: true,
      temporary_price: Math.max(1, Math.floor(getSpecialPrice(cardId) * 0.6)),
      temporary_discount_cost: 0,
    })
  );

  const powerUps = pickDeterministic(
    POWER_UP_KEYS,
    counts.powerups ?? 0,
    seed + 71
  ).map((powerUpId, index) => ({
    game_id: gameId,
    idx: index,
    power_up_id: powerUpId,
    cost: POWER_UP_COST_BY_ID[powerUpId] ?? 100,
    discount_cost: 0,
    purchased: false,
    img: `/powerups/${powerUpId}.png`,
  }));

  const packs = pickDeterministic(PACK_IDS, counts.lootboxes ?? 0, seed + 97).map(
    (packId, index) => ({
      game_id: gameId,
      idx: 4000 + index,
      blister_pack_id: packId,
      cost: getLootBoxPrice(packId),
      discount_cost: 0,
      purchased: false,
    })
  );

  const pokerHandItems = pickDeterministic(
    MOCKED_PLAYS,
    counts.levelups ?? 0,
    seed + 127
  ).map((play, index) => ({
    idx: 5000 + index,
    poker_hand: play.poker_hand,
    level: Number(play.level) + 1,
    points: Number(play.points) + 5,
    multi: Number(play.multi) + 1,
    cost: DEFAULT_POKER_HAND_PRICE,
    discount_cost: 0,
    purchased: false,
  }));

  return {
    commonCards,
    modifierCards,
    specialCards,
    pokerHandItems,
    packs,
    specialSlotItem: {
      game_id: gameId,
      cost: DEFAULT_SPECIAL_SLOT_COST,
      discount_cost: 0,
    },
    burnItem: burnUnlocked
      ? {
          game_id: gameId,
          cost: DEFAULT_BURN_COST,
          discount_cost: 0,
          purchased: false,
        }
      : null,
    powerUps,
  };
};

export const getMockShopRerollCount = (runId: string, shopId: number): number => {
  return rerollCountByShopKey.get(getShopKey(runId, shopId)) ?? 0;
};

export const bumpMockShopRerollCount = (runId: string, shopId: number): number => {
  const key = getShopKey(runId, shopId);
  const next = (rerollCountByShopKey.get(key) ?? 0) + 1;
  rerollCountByShopKey.set(key, next);
  return next;
};

export const buildMockDynamicShopState = (
  params: Omit<BuildMockDynamicStoreParams, "rerollCount">
): MockDynamicStorePayload => {
  return buildMockDynamicStorePayload({
    ...params,
    rerollCount: getMockShopRerollCount(params.runId, params.shopId),
  });
};

export const buildMockDynamicShopStateForReroll = (
  params: Omit<BuildMockDynamicStoreParams, "rerollCount">
): MockDynamicStorePayload => {
  return buildMockDynamicStorePayload({
    ...params,
    rerollCount: bumpMockShopRerollCount(params.runId, params.shopId),
  });
};
