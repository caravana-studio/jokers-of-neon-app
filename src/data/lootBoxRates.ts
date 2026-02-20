// Card types registry with their metadata
export enum CardItemType {
  TRADITIONAL = "traditional",
  JOKER = "joker",
  NEON = "neon",
  NEON_JOKER = "neon_joker",
  SPECIAL_C = "special_c",
  SPECIAL_B = "special_b",
  SPECIAL_A = "special_a",
  SPECIAL_S = "special_s",
  SKIN_SPECIAL_C = "skin_special_c",
  SKIN_SPECIAL_B = "skin_special_b",
  SKIN_SPECIAL_A = "skin_special_a",
  SKIN_SPECIAL_S = "skin_special_s",
}

interface CardTypeMetadata {
  nameKey: string; // i18n translation key
  imageId: number;
  isSpecial: boolean;
  rarity?: string;
}

export const CARD_TYPE_METADATA: Record<CardItemType, CardTypeMetadata> = {
  [CardItemType.TRADITIONAL]: {
    nameKey: "loot-box-rates.cards.traditional",
    imageId: 1,
    isSpecial: false,
  },
  [CardItemType.JOKER]: {
    nameKey: "loot-box-rates.cards.joker",
    imageId: 52,
    isSpecial: false,
  },
  [CardItemType.NEON]: {
    nameKey: "loot-box-rates.cards.neon",
    imageId: 200,
    isSpecial: false,
  },
  [CardItemType.NEON_JOKER]: {
    nameKey: "loot-box-rates.cards.neon-joker",
    imageId: 252,
    isSpecial: false,
  },
  [CardItemType.SPECIAL_C]: {
    nameKey: "loot-box-rates.cards.special-c",
    imageId: 200,
    isSpecial: true,
    rarity: "C",
  },
  [CardItemType.SPECIAL_B]: {
    nameKey: "loot-box-rates.cards.special-b",
    imageId: 201,
    isSpecial: true,
    rarity: "B",
  },
  [CardItemType.SPECIAL_A]: {
    nameKey: "loot-box-rates.cards.special-a",
    imageId: 202,
    isSpecial: true,
    rarity: "A",
  },
  [CardItemType.SPECIAL_S]: {
    nameKey: "loot-box-rates.cards.special-s",
    imageId: 203,
    isSpecial: true,
    rarity: "S",
  },
  [CardItemType.SKIN_SPECIAL_C]: {
    nameKey: "loot-box-rates.cards.skin-special-c",
    imageId: 200,
    isSpecial: true,
    rarity: "C",
  },
  [CardItemType.SKIN_SPECIAL_B]: {
    nameKey: "loot-box-rates.cards.skin-special-b",
    imageId: 201,
    isSpecial: true,
    rarity: "B",
  },
  [CardItemType.SKIN_SPECIAL_A]: {
    nameKey: "loot-box-rates.cards.skin-special-a",
    imageId: 202,
    isSpecial: true,
    rarity: "A",
  },
  [CardItemType.SKIN_SPECIAL_S]: {
    nameKey: "loot-box-rates.cards.skin-special-s",
    imageId: 203,
    isSpecial: true,
    rarity: "S",
  },
};

interface ItemRateEntry {
  itemType: CardItemType;
  percentage: number;
}

interface PackItemSection {
  itemNumber: number;
  rates: ItemRateEntry[];
}

type PackRatesData = PackItemSection[];

// Pack rates by pack ID
export const PACK_RATES: Record<number, PackRatesData> = {
  // Daily Pack (NOT SOLD) (ID: 1)
  1: [
    {
      itemNumber: 1,
      rates: [
        { itemType: CardItemType.TRADITIONAL, percentage: 96.0 },
        { itemType: CardItemType.JOKER, percentage: 2.0 },
        { itemType: CardItemType.NEON, percentage: 2.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 0.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 0.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 0.0 },
        { itemType: CardItemType.SPECIAL_A, percentage: 0.0 },
        { itemType: CardItemType.SPECIAL_S, percentage: 0.0 },
      ],
    },
    {
      itemNumber: 2,
      rates: [
        { itemType: CardItemType.TRADITIONAL, percentage: 55.0 },
        { itemType: CardItemType.JOKER, percentage: 2.0 },
        { itemType: CardItemType.NEON, percentage: 42.9 },
        { itemType: CardItemType.NEON_JOKER, percentage: 0.1 },
        { itemType: CardItemType.SPECIAL_C, percentage: 0.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 0.0 },
        { itemType: CardItemType.SPECIAL_A, percentage: 0.0 },
        { itemType: CardItemType.SPECIAL_S, percentage: 0.0 },
      ],
    },
    {
      itemNumber: 3,
      rates: [
        { itemType: CardItemType.TRADITIONAL, percentage: 0.0 },
        { itemType: CardItemType.JOKER, percentage: 5.0 },
        { itemType: CardItemType.NEON, percentage: 83.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 2.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 8.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 1.9 },
        { itemType: CardItemType.SPECIAL_A, percentage: 0.1 },
        { itemType: CardItemType.SPECIAL_S, percentage: 0.0 },
      ],
    },
  ],

  // Advanced Pack (ID: 2)
  2: [
    {
      itemNumber: 1,
      rates: [
        { itemType: CardItemType.TRADITIONAL, percentage: 96.0 },
        { itemType: CardItemType.JOKER, percentage: 2.0 },
        { itemType: CardItemType.NEON, percentage: 2.0 },
      ],
    },
    {
      itemNumber: 2,
      rates: [
        { itemType: CardItemType.JOKER, percentage: 5.0 },
        { itemType: CardItemType.NEON, percentage: 83.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 2.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 8.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 1.9 },
        { itemType: CardItemType.SPECIAL_A, percentage: 0.1 },
      ],
    },
    {
      itemNumber: 3,
      rates: [
        { itemType: CardItemType.NEON, percentage: 48.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 2.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 40.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 7.0 },
        { itemType: CardItemType.SPECIAL_A, percentage: 2.9 },
        { itemType: CardItemType.SPECIAL_S, percentage: 0.1 },
      ],
    },
  ],

  // Epic Pack (ID: 3)
  3: [
    {
      itemNumber: 1,
      rates: [
        { itemType: CardItemType.TRADITIONAL, percentage: 96.0 },
        { itemType: CardItemType.JOKER, percentage: 2.0 },
        { itemType: CardItemType.NEON, percentage: 2.0 },
      ],
    },
    {
      itemNumber: 2,
      rates: [
        { itemType: CardItemType.TRADITIONAL, percentage: 60.0 },
        { itemType: CardItemType.JOKER, percentage: 2.0 },
        { itemType: CardItemType.NEON, percentage: 37.9 },
        { itemType: CardItemType.NEON_JOKER, percentage: 0.1 },
      ],
    },
    {
      itemNumber: 3,
      rates: [
        { itemType: CardItemType.NEON, percentage: 76.9 },
        { itemType: CardItemType.NEON_JOKER, percentage: 2.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 15.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_A, percentage: 1.0 },
        { itemType: CardItemType.SPECIAL_S, percentage: 0.1 },
      ],
    },
    {
      itemNumber: 4,
      rates: [
        { itemType: CardItemType.NEON, percentage: 21.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 4.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 47.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 15.0 },
        { itemType: CardItemType.SPECIAL_A, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_S, percentage: 3.0 },
      ],
    },
  ],

  // Legendary Pack (ID: 4)
  4: [
    {
      itemNumber: 1,
      rates: [
        { itemType: CardItemType.TRADITIONAL, percentage: 96.0 },
        { itemType: CardItemType.JOKER, percentage: 2.0 },
        { itemType: CardItemType.NEON, percentage: 2.0 },
      ],
    },
    {
      itemNumber: 2,
      rates: [
        { itemType: CardItemType.TRADITIONAL, percentage: 55.0 },
        { itemType: CardItemType.JOKER, percentage: 2.0 },
        { itemType: CardItemType.NEON, percentage: 42.9 },
        { itemType: CardItemType.NEON_JOKER, percentage: 0.1 },
      ],
    },
    {
      itemNumber: 3,
      rates: [
        { itemType: CardItemType.NEON, percentage: 48.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 2.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 40.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 7.0 },
        { itemType: CardItemType.SPECIAL_A, percentage: 2.9 },
        { itemType: CardItemType.SPECIAL_S, percentage: 0.1 },
      ],
    },
    {
      itemNumber: 4,
      rates: [
        { itemType: CardItemType.SPECIAL_B, percentage: 60.0 },
        { itemType: CardItemType.SPECIAL_A, percentage: 30.0 },
        { itemType: CardItemType.SPECIAL_S, percentage: 10.0 },
      ],
    },
  ],

  // Collector Pack (ID: 5)
  5: [
    {
      itemNumber: 1,
      rates: [
        { itemType: CardItemType.TRADITIONAL, percentage: 50.0 },
        { itemType: CardItemType.JOKER, percentage: 20.0 },
        { itemType: CardItemType.NEON, percentage: 10.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 5.0 },
      ],
    },
    {
      itemNumber: 2,
      rates: [
        { itemType: CardItemType.JOKER, percentage: 30.0 },
        { itemType: CardItemType.NEON, percentage: 20.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 20.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_A, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_S, percentage: 5.0 },
      ],
    },
    {
      itemNumber: 3,
      rates: [
        { itemType: CardItemType.NEON, percentage: 20.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 30.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 20.0 },
        { itemType: CardItemType.SPECIAL_A, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_S, percentage: 10.0 },
      ],
    },
    {
      itemNumber: 4,
      rates: [
        { itemType: CardItemType.SPECIAL_A, percentage: 30.0 },
        { itemType: CardItemType.SPECIAL_S, percentage: 10.0 },
        { itemType: CardItemType.SKIN_SPECIAL_C, percentage: 39.9 },
        { itemType: CardItemType.SKIN_SPECIAL_B, percentage: 17.0 },
        { itemType: CardItemType.SKIN_SPECIAL_A, percentage: 3.0 },
        { itemType: CardItemType.SKIN_SPECIAL_S, percentage: 0.1 },
      ],
    },
    {
      itemNumber: 5,
      rates: [
        { itemType: CardItemType.SKIN_SPECIAL_C, percentage: 30.0 },
        { itemType: CardItemType.SKIN_SPECIAL_B, percentage: 30.0 },
        { itemType: CardItemType.SKIN_SPECIAL_A, percentage: 30.0 },
        { itemType: CardItemType.SKIN_SPECIAL_S, percentage: 10.0 },
      ],
    },
  ],

  // Collector XL Pack (ID: 6)
  6: [
    {
      itemNumber: 1,
      rates: [
        { itemType: CardItemType.TRADITIONAL, percentage: 50.0 },
        { itemType: CardItemType.JOKER, percentage: 20.0 },
        { itemType: CardItemType.NEON, percentage: 10.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 5.0 },
      ],
    },
    {
      itemNumber: 2,
      rates: [
        { itemType: CardItemType.JOKER, percentage: 30.0 },
        { itemType: CardItemType.NEON, percentage: 20.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 20.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_A, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_S, percentage: 5.0 },
      ],
    },
    {
      itemNumber: 3,
      rates: [
        { itemType: CardItemType.JOKER, percentage: 30.0 },
        { itemType: CardItemType.NEON, percentage: 20.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 20.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_A, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_S, percentage: 5.0 },
      ],
    },
    {
      itemNumber: 4,
      rates: [
        { itemType: CardItemType.NEON, percentage: 20.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 30.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 20.0 },
        { itemType: CardItemType.SPECIAL_A, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_S, percentage: 10.0 },
      ],
    },
    {
      itemNumber: 5,
      rates: [
        { itemType: CardItemType.NEON, percentage: 20.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 30.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 20.0 },
        { itemType: CardItemType.SPECIAL_A, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_S, percentage: 10.0 },
      ],
    },
    {
      itemNumber: 6,
      rates: [
        { itemType: CardItemType.NEON, percentage: 20.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 30.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 20.0 },
        { itemType: CardItemType.SPECIAL_A, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_S, percentage: 10.0 },
      ],
    },
    {
      itemNumber: 7,
      rates: [
        { itemType: CardItemType.SKIN_SPECIAL_C, percentage: 39.9 },
        { itemType: CardItemType.SKIN_SPECIAL_B, percentage: 17.0 },
        { itemType: CardItemType.SKIN_SPECIAL_A, percentage: 3.0 },
        { itemType: CardItemType.SKIN_SPECIAL_S, percentage: 0.1 },
      ],
    },
    {
      itemNumber: 8,
      rates: [
        { itemType: CardItemType.SKIN_SPECIAL_C, percentage: 39.9 },
        { itemType: CardItemType.SKIN_SPECIAL_B, percentage: 17.0 },
        { itemType: CardItemType.SKIN_SPECIAL_A, percentage: 3.0 },
        { itemType: CardItemType.SKIN_SPECIAL_S, percentage: 0.1 },
      ],
    },
    {
      itemNumber: 9,
      rates: [
        { itemType: CardItemType.SKIN_SPECIAL_C, percentage: 30.0 },
        { itemType: CardItemType.SKIN_SPECIAL_B, percentage: 30.0 },
        { itemType: CardItemType.SKIN_SPECIAL_A, percentage: 30.0 },
        { itemType: CardItemType.SKIN_SPECIAL_S, percentage: 10.0 },
      ],
    },
    {
      itemNumber: 10,
      rates: [
        { itemType: CardItemType.SKIN_SPECIAL_C, percentage: 30.0 },
        { itemType: CardItemType.SKIN_SPECIAL_B, percentage: 30.0 },
        { itemType: CardItemType.SKIN_SPECIAL_A, percentage: 30.0 },
        { itemType: CardItemType.SKIN_SPECIAL_S, percentage: 10.0 },
      ],
    },
  ],

  // Hearts Pack (ID: 8)
  // Specials: ALL_CARDS_TO_HEARTS (A 5%), RANDOM_MULTI_FOR_HEART (B 5%), MULTI_FOR_HEART (C 5%)
  // Modifier: SUIT_HEARTS (10%), Neon Hearts (30%), Hearts cards (45%)
  8: [
    {
      itemNumber: 1,
      rates: [
        { itemType: CardItemType.SPECIAL_A, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 15.0 },
        { itemType: CardItemType.NEON, percentage: 30.0 },
        { itemType: CardItemType.TRADITIONAL, percentage: 45.0 },
      ],
    },
    {
      itemNumber: 2,
      rates: [
        { itemType: CardItemType.SPECIAL_A, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 15.0 },
        { itemType: CardItemType.NEON, percentage: 30.0 },
        { itemType: CardItemType.TRADITIONAL, percentage: 45.0 },
      ],
    },
    {
      itemNumber: 3,
      rates: [
        { itemType: CardItemType.SPECIAL_A, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 15.0 },
        { itemType: CardItemType.NEON, percentage: 30.0 },
        { itemType: CardItemType.TRADITIONAL, percentage: 45.0 },
      ],
    },
    {
      itemNumber: 4,
      rates: [
        { itemType: CardItemType.SPECIAL_A, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 15.0 },
        { itemType: CardItemType.NEON, percentage: 30.0 },
        { itemType: CardItemType.TRADITIONAL, percentage: 45.0 },
      ],
    },
    {
      itemNumber: 5,
      rates: [
        { itemType: CardItemType.SPECIAL_A, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 15.0 },
        { itemType: CardItemType.NEON, percentage: 30.0 },
        { itemType: CardItemType.TRADITIONAL, percentage: 45.0 },
      ],
    },
  ],

  // Spades Pack (ID: 11)
  // Specials: SPADE_TRIO (A 5%), RANDOM_MULTI_FOR_SPADE (B 5%), MULTI_FOR_SPADE (C 5%)
  // Modifier: SUIT_SPADES (10%), Neon Spades (30%), Spades cards (45%)
  11: [
    {
      itemNumber: 1,
      rates: [
        { itemType: CardItemType.SPECIAL_A, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 15.0 },
        { itemType: CardItemType.NEON, percentage: 30.0 },
        { itemType: CardItemType.TRADITIONAL, percentage: 45.0 },
      ],
    },
    {
      itemNumber: 2,
      rates: [
        { itemType: CardItemType.SPECIAL_A, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 15.0 },
        { itemType: CardItemType.NEON, percentage: 30.0 },
        { itemType: CardItemType.TRADITIONAL, percentage: 45.0 },
      ],
    },
    {
      itemNumber: 3,
      rates: [
        { itemType: CardItemType.SPECIAL_A, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 15.0 },
        { itemType: CardItemType.NEON, percentage: 30.0 },
        { itemType: CardItemType.TRADITIONAL, percentage: 45.0 },
      ],
    },
    {
      itemNumber: 4,
      rates: [
        { itemType: CardItemType.SPECIAL_A, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 15.0 },
        { itemType: CardItemType.NEON, percentage: 30.0 },
        { itemType: CardItemType.TRADITIONAL, percentage: 45.0 },
      ],
    },
    {
      itemNumber: 5,
      rates: [
        { itemType: CardItemType.SPECIAL_A, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 15.0 },
        { itemType: CardItemType.NEON, percentage: 30.0 },
        { itemType: CardItemType.TRADITIONAL, percentage: 45.0 },
      ],
    },
  ],

  // Diamonds Pack (ID: 12)
  // Specials: LUCKY_HAND (C 5%), MULTI_FOR_DIAMOND (C 5%), RANDOM_MULTI_FOR_DIAMOND (B 5%)
  // Modifier: SUIT_DIAMONDS (10%), Neon Diamonds (30%), Diamonds cards (45%)
  12: [
    {
      itemNumber: 1,
      rates: [
        { itemType: CardItemType.SPECIAL_B, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 20.0 },
        { itemType: CardItemType.NEON, percentage: 30.0 },
        { itemType: CardItemType.TRADITIONAL, percentage: 45.0 },
      ],
    },
    {
      itemNumber: 2,
      rates: [
        { itemType: CardItemType.SPECIAL_B, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 20.0 },
        { itemType: CardItemType.NEON, percentage: 30.0 },
        { itemType: CardItemType.TRADITIONAL, percentage: 45.0 },
      ],
    },
    {
      itemNumber: 3,
      rates: [
        { itemType: CardItemType.SPECIAL_B, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 20.0 },
        { itemType: CardItemType.NEON, percentage: 30.0 },
        { itemType: CardItemType.TRADITIONAL, percentage: 45.0 },
      ],
    },
    {
      itemNumber: 4,
      rates: [
        { itemType: CardItemType.SPECIAL_B, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 20.0 },
        { itemType: CardItemType.NEON, percentage: 30.0 },
        { itemType: CardItemType.TRADITIONAL, percentage: 45.0 },
      ],
    },
    {
      itemNumber: 5,
      rates: [
        { itemType: CardItemType.SPECIAL_B, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 20.0 },
        { itemType: CardItemType.NEON, percentage: 30.0 },
        { itemType: CardItemType.TRADITIONAL, percentage: 45.0 },
      ],
    },
  ],

  // Clubs Pack (ID: 13)
  // Specials: MULTI_FOR_CLUB (C 5%), RANDOM_MULTI_FOR_CLUB (B 5%)
  // Modifier: SUIT_CLUBS (10%), Neon Clubs (30%), Clubs cards (50%)
  13: [
    {
      itemNumber: 1,
      rates: [
        { itemType: CardItemType.SPECIAL_B, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 15.0 },
        { itemType: CardItemType.NEON, percentage: 30.0 },
        { itemType: CardItemType.TRADITIONAL, percentage: 50.0 },
      ],
    },
    {
      itemNumber: 2,
      rates: [
        { itemType: CardItemType.SPECIAL_B, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 15.0 },
        { itemType: CardItemType.NEON, percentage: 30.0 },
        { itemType: CardItemType.TRADITIONAL, percentage: 50.0 },
      ],
    },
    {
      itemNumber: 3,
      rates: [
        { itemType: CardItemType.SPECIAL_B, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 15.0 },
        { itemType: CardItemType.NEON, percentage: 30.0 },
        { itemType: CardItemType.TRADITIONAL, percentage: 50.0 },
      ],
    },
    {
      itemNumber: 4,
      rates: [
        { itemType: CardItemType.SPECIAL_B, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 15.0 },
        { itemType: CardItemType.NEON, percentage: 30.0 },
        { itemType: CardItemType.TRADITIONAL, percentage: 50.0 },
      ],
    },
    {
      itemNumber: 5,
      rates: [
        { itemType: CardItemType.SPECIAL_B, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 15.0 },
        { itemType: CardItemType.NEON, percentage: 30.0 },
        { itemType: CardItemType.TRADITIONAL, percentage: 50.0 },
      ],
    },
  ],

  // Basic Pack S2 (ID: 21) - same rates as Basic Pack (ID: 1)
  21: [
    {
      itemNumber: 1,
      rates: [
        { itemType: CardItemType.TRADITIONAL, percentage: 96.0 },
        { itemType: CardItemType.JOKER, percentage: 2.0 },
        { itemType: CardItemType.NEON, percentage: 2.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 0.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 0.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 0.0 },
        { itemType: CardItemType.SPECIAL_A, percentage: 0.0 },
        { itemType: CardItemType.SPECIAL_S, percentage: 0.0 },
      ],
    },
    {
      itemNumber: 2,
      rates: [
        { itemType: CardItemType.TRADITIONAL, percentage: 55.0 },
        { itemType: CardItemType.JOKER, percentage: 2.0 },
        { itemType: CardItemType.NEON, percentage: 42.9 },
        { itemType: CardItemType.NEON_JOKER, percentage: 0.1 },
        { itemType: CardItemType.SPECIAL_C, percentage: 0.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 0.0 },
        { itemType: CardItemType.SPECIAL_A, percentage: 0.0 },
        { itemType: CardItemType.SPECIAL_S, percentage: 0.0 },
      ],
    },
    {
      itemNumber: 3,
      rates: [
        { itemType: CardItemType.TRADITIONAL, percentage: 0.0 },
        { itemType: CardItemType.JOKER, percentage: 5.0 },
        { itemType: CardItemType.NEON, percentage: 83.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 2.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 8.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 1.9 },
        { itemType: CardItemType.SPECIAL_A, percentage: 0.1 },
        { itemType: CardItemType.SPECIAL_S, percentage: 0.0 },
      ],
    },
  ],

  // Advanced Pack S2 (ID: 22) - same rates as Advanced Pack (ID: 2)
  22: [
    {
      itemNumber: 1,
      rates: [
        { itemType: CardItemType.TRADITIONAL, percentage: 96.0 },
        { itemType: CardItemType.JOKER, percentage: 2.0 },
        { itemType: CardItemType.NEON, percentage: 2.0 },
      ],
    },
    {
      itemNumber: 2,
      rates: [
        { itemType: CardItemType.JOKER, percentage: 5.0 },
        { itemType: CardItemType.NEON, percentage: 83.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 2.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 8.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 1.9 },
        { itemType: CardItemType.SPECIAL_A, percentage: 0.1 },
      ],
    },
    {
      itemNumber: 3,
      rates: [
        { itemType: CardItemType.NEON, percentage: 48.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 2.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 40.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 7.0 },
        { itemType: CardItemType.SPECIAL_A, percentage: 2.9 },
        { itemType: CardItemType.SPECIAL_S, percentage: 0.1 },
      ],
    },
  ],

  // Epic Pack S2 (ID: 23) - same rates as Epic Pack (ID: 3)
  23: [
    {
      itemNumber: 1,
      rates: [
        { itemType: CardItemType.TRADITIONAL, percentage: 96.0 },
        { itemType: CardItemType.JOKER, percentage: 2.0 },
        { itemType: CardItemType.NEON, percentage: 2.0 },
      ],
    },
    {
      itemNumber: 2,
      rates: [
        { itemType: CardItemType.TRADITIONAL, percentage: 60.0 },
        { itemType: CardItemType.JOKER, percentage: 2.0 },
        { itemType: CardItemType.NEON, percentage: 37.9 },
        { itemType: CardItemType.NEON_JOKER, percentage: 0.1 },
      ],
    },
    {
      itemNumber: 3,
      rates: [
        { itemType: CardItemType.NEON, percentage: 76.9 },
        { itemType: CardItemType.NEON_JOKER, percentage: 2.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 15.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_A, percentage: 1.0 },
        { itemType: CardItemType.SPECIAL_S, percentage: 0.1 },
      ],
    },
    {
      itemNumber: 4,
      rates: [
        { itemType: CardItemType.NEON, percentage: 21.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 4.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 47.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 15.0 },
        { itemType: CardItemType.SPECIAL_A, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_S, percentage: 3.0 },
      ],
    },
  ],

  // Legendary Pack S2 (ID: 24) - same rates as Legendary Pack (ID: 4)
  24: [
    {
      itemNumber: 1,
      rates: [
        { itemType: CardItemType.TRADITIONAL, percentage: 96.0 },
        { itemType: CardItemType.JOKER, percentage: 2.0 },
        { itemType: CardItemType.NEON, percentage: 2.0 },
      ],
    },
    {
      itemNumber: 2,
      rates: [
        { itemType: CardItemType.TRADITIONAL, percentage: 55.0 },
        { itemType: CardItemType.JOKER, percentage: 2.0 },
        { itemType: CardItemType.NEON, percentage: 42.9 },
        { itemType: CardItemType.NEON_JOKER, percentage: 0.1 },
      ],
    },
    {
      itemNumber: 3,
      rates: [
        { itemType: CardItemType.NEON, percentage: 48.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 2.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 40.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 7.0 },
        { itemType: CardItemType.SPECIAL_A, percentage: 2.9 },
        { itemType: CardItemType.SPECIAL_S, percentage: 0.1 },
      ],
    },
    {
      itemNumber: 4,
      rates: [
        { itemType: CardItemType.SPECIAL_B, percentage: 60.0 },
        { itemType: CardItemType.SPECIAL_A, percentage: 30.0 },
        { itemType: CardItemType.SPECIAL_S, percentage: 10.0 },
      ],
    },
  ],

  // Collector Pack S2 (ID: 25) - same rates as Collector Pack (ID: 5)
  25: [
    {
      itemNumber: 1,
      rates: [
        { itemType: CardItemType.TRADITIONAL, percentage: 50.0 },
        { itemType: CardItemType.JOKER, percentage: 20.0 },
        { itemType: CardItemType.NEON, percentage: 10.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 5.0 },
      ],
    },
    {
      itemNumber: 2,
      rates: [
        { itemType: CardItemType.JOKER, percentage: 30.0 },
        { itemType: CardItemType.NEON, percentage: 20.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 20.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_A, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_S, percentage: 5.0 },
      ],
    },
    {
      itemNumber: 3,
      rates: [
        { itemType: CardItemType.NEON, percentage: 20.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 30.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 20.0 },
        { itemType: CardItemType.SPECIAL_A, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_S, percentage: 10.0 },
      ],
    },
    {
      itemNumber: 4,
      rates: [
        { itemType: CardItemType.SPECIAL_A, percentage: 30.0 },
        { itemType: CardItemType.SPECIAL_S, percentage: 10.0 },
        { itemType: CardItemType.SKIN_SPECIAL_C, percentage: 39.9 },
        { itemType: CardItemType.SKIN_SPECIAL_B, percentage: 17.0 },
        { itemType: CardItemType.SKIN_SPECIAL_A, percentage: 3.0 },
        { itemType: CardItemType.SKIN_SPECIAL_S, percentage: 0.1 },
      ],
    },
    {
      itemNumber: 5,
      rates: [
        { itemType: CardItemType.SKIN_SPECIAL_C, percentage: 30.0 },
        { itemType: CardItemType.SKIN_SPECIAL_B, percentage: 30.0 },
        { itemType: CardItemType.SKIN_SPECIAL_A, percentage: 30.0 },
        { itemType: CardItemType.SKIN_SPECIAL_S, percentage: 10.0 },
      ],
    },
  ],

  // Collector XL Pack S2 (ID: 26) - same rates as Collector XL Pack (ID: 6)
  26: [
    {
      itemNumber: 1,
      rates: [
        { itemType: CardItemType.TRADITIONAL, percentage: 50.0 },
        { itemType: CardItemType.JOKER, percentage: 20.0 },
        { itemType: CardItemType.NEON, percentage: 10.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 5.0 },
      ],
    },
    {
      itemNumber: 2,
      rates: [
        { itemType: CardItemType.JOKER, percentage: 30.0 },
        { itemType: CardItemType.NEON, percentage: 20.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 20.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_A, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_S, percentage: 5.0 },
      ],
    },
    {
      itemNumber: 3,
      rates: [
        { itemType: CardItemType.JOKER, percentage: 30.0 },
        { itemType: CardItemType.NEON, percentage: 20.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 20.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_A, percentage: 5.0 },
        { itemType: CardItemType.SPECIAL_S, percentage: 5.0 },
      ],
    },
    {
      itemNumber: 4,
      rates: [
        { itemType: CardItemType.NEON, percentage: 20.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 30.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 20.0 },
        { itemType: CardItemType.SPECIAL_A, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_S, percentage: 10.0 },
      ],
    },
    {
      itemNumber: 5,
      rates: [
        { itemType: CardItemType.NEON, percentage: 20.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 30.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 20.0 },
        { itemType: CardItemType.SPECIAL_A, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_S, percentage: 10.0 },
      ],
    },
    {
      itemNumber: 6,
      rates: [
        { itemType: CardItemType.NEON, percentage: 20.0 },
        { itemType: CardItemType.NEON_JOKER, percentage: 30.0 },
        { itemType: CardItemType.SPECIAL_C, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_B, percentage: 20.0 },
        { itemType: CardItemType.SPECIAL_A, percentage: 10.0 },
        { itemType: CardItemType.SPECIAL_S, percentage: 10.0 },
      ],
    },
    {
      itemNumber: 7,
      rates: [
        { itemType: CardItemType.SKIN_SPECIAL_C, percentage: 39.9 },
        { itemType: CardItemType.SKIN_SPECIAL_B, percentage: 17.0 },
        { itemType: CardItemType.SKIN_SPECIAL_A, percentage: 3.0 },
        { itemType: CardItemType.SKIN_SPECIAL_S, percentage: 0.1 },
      ],
    },
    {
      itemNumber: 8,
      rates: [
        { itemType: CardItemType.SKIN_SPECIAL_C, percentage: 39.9 },
        { itemType: CardItemType.SKIN_SPECIAL_B, percentage: 17.0 },
        { itemType: CardItemType.SKIN_SPECIAL_A, percentage: 3.0 },
        { itemType: CardItemType.SKIN_SPECIAL_S, percentage: 0.1 },
      ],
    },
    {
      itemNumber: 9,
      rates: [
        { itemType: CardItemType.SKIN_SPECIAL_C, percentage: 30.0 },
        { itemType: CardItemType.SKIN_SPECIAL_B, percentage: 30.0 },
        { itemType: CardItemType.SKIN_SPECIAL_A, percentage: 30.0 },
        { itemType: CardItemType.SKIN_SPECIAL_S, percentage: 10.0 },
      ],
    },
    {
      itemNumber: 10,
      rates: [
        { itemType: CardItemType.SKIN_SPECIAL_C, percentage: 30.0 },
        { itemType: CardItemType.SKIN_SPECIAL_B, percentage: 30.0 },
        { itemType: CardItemType.SKIN_SPECIAL_A, percentage: 30.0 },
        { itemType: CardItemType.SKIN_SPECIAL_S, percentage: 10.0 },
      ],
    },
  ],
};
