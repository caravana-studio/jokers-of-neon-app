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
  visitId: number;
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
type MockPurchasedItemKind =
  | "CARD"
  | "PACK"
  | "POKER_HAND"
  | "POWER_UP"
  | "SPECIAL_SLOT"
  | "BURN";

interface MockPurchasedSnapshot {
  cardIdxs: number[];
  packIdxs: number[];
  pokerHandIdxs: number[];
  powerUpIdxs: number[];
  specialSlotPurchased: boolean;
  burnPurchased: boolean;
}

const purchasedByShopSnapshot = new Map<string, MockPurchasedSnapshot>();

const getShopKey = (runId: string, shopId: number, visitId: number) =>
  `${runId}:${shopId}:v${visitId}`;
const getShopSnapshotKey = (
  runId: string,
  shopId: number,
  visitId: number,
  rerollCount: number
) => `${runId}:${shopId}:v${visitId}:r${rerollCount}`;

const getOrCreatePurchasedSnapshot = (
  runId: string,
  shopId: number,
  visitId: number,
  rerollCount: number
): MockPurchasedSnapshot => {
  const key = getShopSnapshotKey(runId, shopId, visitId, rerollCount);
  const existing = purchasedByShopSnapshot.get(key);
  if (existing) {
    return existing;
  }

  const emptySnapshot: MockPurchasedSnapshot = {
    cardIdxs: [],
    packIdxs: [],
    pokerHandIdxs: [],
    powerUpIdxs: [],
    specialSlotPurchased: false,
    burnPurchased: false,
  };
  purchasedByShopSnapshot.set(key, emptySnapshot);
  return emptySnapshot;
};

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
  visitId,
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
  const purchasedSnapshot = getOrCreatePurchasedSnapshot(
    runId,
    shopId,
    visitId,
    rerollCount
  );
  const purchasedCardIdxs = new Set(purchasedSnapshot.cardIdxs);
  const purchasedPackIdxs = new Set(purchasedSnapshot.packIdxs);
  const purchasedPokerHandIdxs = new Set(purchasedSnapshot.pokerHandIdxs);
  const purchasedPowerUpIdxs = new Set(purchasedSnapshot.powerUpIdxs);

  const commonCards = pickDeterministic(
    COMMON_CARD_IDS,
    counts.traditionals ?? 0,
    seed + 11
  ).map((cardId, index) => {
    const idx = 1000 + index;
    return {
      ...buildCard(cardId, idx, DEFAULT_COMMON_CARD_PRICE),
      purchased: purchasedCardIdxs.has(idx),
    };
  });

  const modifierCards = pickDeterministic(
    availableModifierIds,
    counts.modifiers ?? 0,
    seed + 31
  ).map((cardId, index) => {
    const idx = 2000 + index;
    return {
      ...buildCard(cardId, idx, getModifierPrice(cardId), {
        isModifier: true,
      }),
      purchased: purchasedCardIdxs.has(idx),
    };
  });

  const specialCards = pickDeterministic(
    SPECIAL_IDS,
    counts.specials ?? 0,
    seed + 53
  ).map((cardId, index) => {
    const idx = 3000 + index;
    return {
      ...buildCard(cardId, idx, getSpecialPrice(cardId), {
        isSpecial: true,
        temporary: true,
        temporary_price: Math.max(1, Math.floor(getSpecialPrice(cardId) * 0.6)),
        temporary_discount_cost: 0,
      }),
      purchased: purchasedCardIdxs.has(idx),
    };
  });

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
    purchased: purchasedPowerUpIdxs.has(index),
    img: `/powerups/${powerUpId}.png`,
  }));

  const packs = pickDeterministic(PACK_IDS, counts.lootboxes ?? 0, seed + 97).map(
    (packId, index) => {
      const idx = 4000 + index;
      return {
        game_id: gameId,
        idx,
        blister_pack_id: packId,
        cost: getLootBoxPrice(packId),
        discount_cost: 0,
        purchased: purchasedPackIdxs.has(idx),
      };
    }
  );

  const pokerHandItems = pickDeterministic(
    MOCKED_PLAYS,
    counts.levelups ?? 0,
    seed + 127
  ).map((play, index) => {
    const idx = 5000 + index;
    return {
      idx,
      poker_hand: play.poker_hand,
      level: Number(play.level) + 1,
      points: Number(play.points) + 5,
      multi: Number(play.multi) + 1,
      cost: DEFAULT_POKER_HAND_PRICE,
      discount_cost: 0,
      purchased: purchasedPokerHandIdxs.has(idx),
    };
  });

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
          purchased: purchasedSnapshot.burnPurchased,
        }
      : null,
    powerUps,
  };
};

export const getMockShopRerollCount = (
  runId: string,
  shopId: number,
  visitId: number
): number => {
  return rerollCountByShopKey.get(getShopKey(runId, shopId, visitId)) ?? 0;
};

export const bumpMockShopRerollCount = (
  runId: string,
  shopId: number,
  visitId: number
): number => {
  const key = getShopKey(runId, shopId, visitId);
  const next = (rerollCountByShopKey.get(key) ?? 0) + 1;
  rerollCountByShopKey.set(key, next);
  return next;
};

export const buildMockDynamicShopState = (
  params: Omit<BuildMockDynamicStoreParams, "rerollCount">
): MockDynamicStorePayload => {
  return buildMockDynamicStorePayload({
    ...params,
    rerollCount: getMockShopRerollCount(
      params.runId,
      params.shopId,
      params.visitId
    ),
  });
};

export const buildMockDynamicShopStateForReroll = (
  params: Omit<BuildMockDynamicStoreParams, "rerollCount">
): MockDynamicStorePayload => {
  return buildMockDynamicStorePayload({
    ...params,
    rerollCount: bumpMockShopRerollCount(
      params.runId,
      params.shopId,
      params.visitId
    ),
  });
};

interface MarkMockPurchaseParams {
  runId: string;
  shopId: number;
  visitId: number;
  kind: MockPurchasedItemKind;
  idx?: number;
}

export const markMockShopItemPurchased = ({
  runId,
  shopId,
  visitId,
  kind,
  idx,
}: MarkMockPurchaseParams): void => {
  const rerollCount = getMockShopRerollCount(runId, shopId, visitId);
  const snapshot = getOrCreatePurchasedSnapshot(runId, shopId, visitId, rerollCount);

  if (kind === "SPECIAL_SLOT") {
    snapshot.specialSlotPurchased = true;
    return;
  }

  if (kind === "BURN") {
    snapshot.burnPurchased = true;
    return;
  }

  if (idx === undefined) {
    return;
  }

  const pushUnique = (list: number[]) => {
    if (!list.includes(idx)) {
      list.push(idx);
    }
  };

  if (kind === "CARD") {
    pushUnique(snapshot.cardIdxs);
    return;
  }

  if (kind === "PACK") {
    pushUnique(snapshot.packIdxs);
    return;
  }

  if (kind === "POKER_HAND") {
    pushUnique(snapshot.pokerHandIdxs);
    return;
  }

  if (kind === "POWER_UP") {
    pushUnique(snapshot.powerUpIdxs);
  }
};

export const isMockShopItemPurchased = ({
  runId,
  shopId,
  visitId,
  kind,
  idx,
}: MarkMockPurchaseParams): boolean => {
  const rerollCount = getMockShopRerollCount(runId, shopId, visitId);
  const snapshot = getOrCreatePurchasedSnapshot(runId, shopId, visitId, rerollCount);

  if (kind === "SPECIAL_SLOT") {
    return snapshot.specialSlotPurchased;
  }

  if (kind === "BURN") {
    return snapshot.burnPurchased;
  }

  if (idx === undefined) {
    return false;
  }

  if (kind === "CARD") {
    return snapshot.cardIdxs.includes(idx);
  }

  if (kind === "PACK") {
    return snapshot.packIdxs.includes(idx);
  }

  if (kind === "POKER_HAND") {
    return snapshot.pokerHandIdxs.includes(idx);
  }

  if (kind === "POWER_UP") {
    return snapshot.powerUpIdxs.includes(idx);
  }

  return false;
};
