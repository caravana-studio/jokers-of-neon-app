import { PACK_RATES, CardItemType, CARD_TYPE_METADATA } from "../data/lootBoxRates";

interface CardWithPosition {
  card_id: number;
  skin_id: number;
  itemPosition: number;
}

/**
 * Determines the card type based on card_id and skin_id
 */
function getCardItemType(cardId: number, skinId: number): CardItemType {
  // Special cards with skin (skin_id > 1)
  if (skinId > 1) {
    // Special cards are in range 10000-10999
    if (cardId >= 10000 && cardId < 11000) {
      // Determine rarity by checking CARD_TYPE_METADATA
      // For now, we'll approximate based on card_id ranges
      if (cardId >= 10000 && cardId < 10020) {
        return CardItemType.SKIN_SPECIAL_C;
      } else if (cardId >= 10020 && cardId < 10050) {
        return CardItemType.SKIN_SPECIAL_B;
      } else if (cardId >= 10050 && cardId < 10100) {
        return CardItemType.SKIN_SPECIAL_A;
      } else {
        return CardItemType.SKIN_SPECIAL_S;
      }
    }
  }

  // Neon Joker
  if (cardId === 252) {
    return CardItemType.NEON_JOKER;
  }

  // Regular Joker
  if (cardId === 52 || cardId === 53) {
    return CardItemType.JOKER;
  }

  // Neon cards (200-251)
  if (cardId >= 200 && cardId < 252) {
    return CardItemType.NEON;
  }

  // Special cards without skin (10000-10999)
  if (cardId >= 10000 && cardId < 11000) {
    // Approximate rarity based on card_id
    if (cardId >= 10000 && cardId < 10030) {
      return CardItemType.SPECIAL_C;
    } else if (cardId >= 10030 && cardId < 10070) {
      return CardItemType.SPECIAL_B;
    } else if (cardId >= 10070 && cardId < 10110) {
      return CardItemType.SPECIAL_A;
    } else {
      return CardItemType.SPECIAL_S;
    }
  }

  // Traditional cards (0-51, excluding jokers)
  return CardItemType.TRADITIONAL;
}

/**
 * Finds the best matching item position for a card based on pack rates
 */
function findBestItemPosition(
  cardType: CardItemType,
  packId: number,
  usedPositions: Set<number>
): number {
  const packRates = PACK_RATES[packId];

  if (!packRates) {
    // If pack rates not defined, return a default position
    return 1;
  }

  // Find all items where this card type can appear (percentage > 0)
  const validItems = packRates
    .filter((item) =>
      item.rates.some(
        (rate) => rate.itemType === cardType && rate.percentage > 0
      )
    )
    .map((item) => item.itemNumber);

  if (validItems.length === 0) {
    // Card type not found in rates, assign to first available position
    for (let i = 1; i <= packRates.length; i++) {
      if (!usedPositions.has(i)) {
        return i;
      }
    }
    return 1;
  }

  // Find the first valid position that hasn't been used
  for (const itemNumber of validItems) {
    if (!usedPositions.has(itemNumber)) {
      return itemNumber;
    }
  }

  // If all valid positions are used, use the first valid one
  return validItems[0];
}

/**
 * Sorts pack cards according to pack rates structure
 *
 * This ensures that cards appear in positions that match their appearance rates.
 * For example, if special cards can only appear in Item 3, they will be positioned there.
 *
 * @param cards - Array of cards from the pack (as returned by API)
 * @param packId - The pack ID (1-6)
 * @returns Sorted array of cards matching the pack's item structure
 */
export function sortPackCardsByRates<T extends { card_id: number; skin_id: number }>(
  cards: T[],
  packId: number
): T[] {
  const packRates = PACK_RATES[packId];

  // If pack rates are not defined, fall back to original sorting
  if (!packRates) {
    return [...cards].sort((a, b) => {
      if (a.skin_id !== b.skin_id) {
        return b.skin_id - a.skin_id;
      }
      return b.card_id - a.card_id;
    });
  }

  // Classify each card and assign to best item position
  const cardsWithPositions: (T & { itemPosition: number; cardType: CardItemType })[] = [];
  const usedPositions = new Set<number>();

  for (const card of cards) {
    const cardType = getCardItemType(card.card_id, card.skin_id);
    const itemPosition = findBestItemPosition(cardType, packId, usedPositions);

    cardsWithPositions.push({
      ...card,
      itemPosition,
      cardType,
    });

    usedPositions.add(itemPosition);
  }

  // Sort by item position (ascending), then by special cards first, then by rarity
  return cardsWithPositions.sort((a, b) => {
    // Primary sort: by item position
    if (a.itemPosition !== b.itemPosition) {
      return a.itemPosition - b.itemPosition;
    }

    // Secondary sort: special cards with skin first
    if (a.skin_id > 1 && b.skin_id <= 1) return -1;
    if (a.skin_id <= 1 && b.skin_id > 1) return 1;

    // Tertiary sort: higher card_id first (rarer cards)
    return b.card_id - a.card_id;
  });
}
