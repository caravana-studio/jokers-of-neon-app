import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { RARITY } from "../../constants/rarity";
import { PACK_RATES, CardItemType } from "../../data/lootBoxRates";
import { SKINS_RARITY, SPECIALS_RARITY } from "../../data/specialCards";
import { CARDS_SUIT_DATA } from "../../data/traditionalCards";
import { ExternalPack, SimplifiedCard } from "./ExternalPack";

const DEFAULT_PACK_ID = 1;

const TRADITIONAL_IDS = Object.keys(CARDS_SUIT_DATA)
  .map(Number)
  .filter((id) => id >= 0 && id < 52);
const NEON_IDS = TRADITIONAL_IDS.map((id) => id + 200);
const JOKER_IDS = [52, 53];
const NEON_JOKER_IDS = [252, 253];

const SPECIALS_BY_RARITY = Object.entries(SPECIALS_RARITY).reduce(
  (acc, [id, rarity]) => {
    acc[rarity].push(Number(id));
    return acc;
  },
  {
    [RARITY.C]: [] as number[],
    [RARITY.B]: [] as number[],
    [RARITY.A]: [] as number[],
    [RARITY.S]: [] as number[],
    [RARITY.SS]: [] as number[],
  },
);

const SKINNED_SPECIALS: SimplifiedCard[] = [
  { card_id: 10101, skin_id: 2 },
  { card_id: 10104, skin_id: 2 },
  { card_id: 10105, skin_id: 2 },
  { card_id: 10107, skin_id: 101 },
  { card_id: 10109, skin_id: 2 },
  { card_id: 10110, skin_id: 2 },
  { card_id: 10111, skin_id: 2 },
  { card_id: 10113, skin_id: 2 },
  { card_id: 10114, skin_id: 2 },
];

const SKINNED_BY_RARITY = SKINNED_SPECIALS.reduce(
  (acc, card) => {
    const rarity = SKINS_RARITY[card.skin_id ?? 0];
    if (rarity) {
      acc[rarity].push(card);
    }
    return acc;
  },
  {
    [RARITY.C]: [] as SimplifiedCard[],
    [RARITY.B]: [] as SimplifiedCard[],
    [RARITY.A]: [] as SimplifiedCard[],
    [RARITY.S]: [] as SimplifiedCard[],
    [RARITY.SS]: [] as SimplifiedCard[],
  },
);

const SPECIAL_RARITY_BY_TYPE: Partial<Record<CardItemType, RARITY>> = {
  [CardItemType.SPECIAL_C]: RARITY.C,
  [CardItemType.SPECIAL_B]: RARITY.B,
  [CardItemType.SPECIAL_A]: RARITY.A,
  [CardItemType.SPECIAL_S]: RARITY.S,
  [CardItemType.SKIN_SPECIAL_C]: RARITY.C,
  [CardItemType.SKIN_SPECIAL_B]: RARITY.B,
  [CardItemType.SKIN_SPECIAL_A]: RARITY.A,
  [CardItemType.SKIN_SPECIAL_S]: RARITY.S,
};

const pickRandom = <T,>(items: T[], fallback: T) =>
  items.length > 0 ? items[Math.floor(Math.random() * items.length)] : fallback;

const pickWeightedType = (rates: { itemType: CardItemType; percentage: number }[]) => {
  const total = rates.reduce((sum, rate) => sum + rate.percentage, 0);
  let roll = Math.random() * total;
  for (const rate of rates) {
    roll -= rate.percentage;
    if (roll <= 0) return rate.itemType;
  }
  return rates[rates.length - 1]?.itemType ?? CardItemType.TRADITIONAL;
};

const getSkinnedPool = (rarity?: RARITY) => {
  const fallback =
    SKINNED_BY_RARITY[RARITY.A].length > 0
      ? SKINNED_BY_RARITY[RARITY.A]
      : SKINNED_BY_RARITY[RARITY.B];
  if (!rarity) return fallback;
  return SKINNED_BY_RARITY[rarity].length > 0
    ? SKINNED_BY_RARITY[rarity]
    : fallback;
};

const pickCardForType = (itemType: CardItemType): SimplifiedCard => {
  switch (itemType) {
    case CardItemType.TRADITIONAL:
      return { card_id: pickRandom(TRADITIONAL_IDS, 0), skin_id: 0 };
    case CardItemType.JOKER:
      return { card_id: pickRandom(JOKER_IDS, 52), skin_id: 0 };
    case CardItemType.NEON:
      return { card_id: pickRandom(NEON_IDS, 200), skin_id: 0 };
    case CardItemType.NEON_JOKER:
      return { card_id: pickRandom(NEON_JOKER_IDS, 252), skin_id: 0 };
    case CardItemType.SPECIAL_C:
    case CardItemType.SPECIAL_B:
    case CardItemType.SPECIAL_A:
    case CardItemType.SPECIAL_S: {
      const rarity = SPECIAL_RARITY_BY_TYPE[itemType] ?? RARITY.C;
      const pool = SPECIALS_BY_RARITY[rarity];
      return { card_id: pickRandom(pool, 10000), skin_id: 0 };
    }
    case CardItemType.SKIN_SPECIAL_C:
    case CardItemType.SKIN_SPECIAL_B:
    case CardItemType.SKIN_SPECIAL_A:
    case CardItemType.SKIN_SPECIAL_S: {
      const rarity = SPECIAL_RARITY_BY_TYPE[itemType];
      const pool = getSkinnedPool(rarity);
      if (pool.length > 0) {
        return pickRandom(pool, { card_id: 10101, skin_id: 2 });
      }
      const fallback = SPECIALS_BY_RARITY[rarity ?? RARITY.C];
      return { card_id: pickRandom(fallback, 10000), skin_id: 0 };
    }
    default:
      return { card_id: pickRandom(TRADITIONAL_IDS, 0), skin_id: 0 };
  }
};

const buildMockPack = (packId: number) => {
  const packRates = PACK_RATES[packId] ?? PACK_RATES[DEFAULT_PACK_ID];
  return packRates.map((section) => pickCardForType(pickWeightedType(section.rates)));
};

const buildOwnedCardIds = (cards: SimplifiedCard[]) => {
  const source = cards.slice(1);
  return source.map(({ card_id, skin_id }) => `${card_id}_${skin_id ?? 0}`);
};

const parsePackId = (packId?: string) => {
  const parsed = Number(packId);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_PACK_ID;
};

export const ExternalPackTestPage = () => {
  const { packId } = useParams();
  const resolvedPackId = parsePackId(packId);

  const { initialCards, ownedCardIds } = useMemo(() => {
    const cards = buildMockPack(resolvedPackId);
    return {
      initialCards: cards,
      ownedCardIds: buildOwnedCardIds(cards),
    };
  }, [resolvedPackId]);

  return (
    <ExternalPack
      packId={resolvedPackId}
      initialCards={initialCards}
      ownedCardIds={ownedCardIds}
      returnTo="/test"
    />
  );
};
