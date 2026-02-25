export const specialCardIds = {
  ALL_TO_HEARTS: 10014,
  EASY_FLUSH: 10009,
  EASY_STRAIGHT: 10008,
  SPECIAL_CARDS_BLOCKS_SUIT_CHANGE: 10014,
  STRAIGHT_TO_HIGH_STRAIGHT: 10201,
};

// Special cards that can transform played cards (suit/neon/rank).
// When any of these are active, play events must be driven by backend events.
export const CONVERTER_SPECIAL_CARD_IDS = [
  specialCardIds.ALL_TO_HEARTS,
  10025, // Neon Synergy
  10026, // Neon Doctrine (legacy)
  10073, // Relativity (legacy)
  10201, // Relativity
  10208, // Neon Doctrine
  10210, // Neon Synergy
] as const;

export const CONVERTER_SPECIAL_CARD_IDS_SET = new Set<number>(
  CONVERTER_SPECIAL_CARD_IDS
);
