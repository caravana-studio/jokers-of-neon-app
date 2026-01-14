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
};
