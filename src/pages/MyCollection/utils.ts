import { SPECIALS_RARITY } from "../../data/specialCards";
import { Collection, NftCards } from "./types";

export function fillCollections(collections: Collection[]): Collection[] {
  // Create a map to organize cards by category
  const cardsByCategory = new Map<string, Set<string>>();

  // Process all special cards to find categories and their cards
  Object.keys(SPECIALS_RARITY).forEach((cardId) => {
    // Extract category ID (2nd and 3rd digits)
    const categoryId = cardId.substring(1, 3);

    // Skip season 0
    if (categoryId === "00") return;

    // Extract card number (4th and 5th digits)
    const cardNumber = cardId.substring(3, 5);

    if (!cardsByCategory.has(categoryId)) {
      cardsByCategory.set(categoryId, new Set());
    }
    cardsByCategory.get(categoryId)?.add(cardNumber);
  });

  // Create a map of existing collections for quick lookup
  const existingCollections = new Map(
    collections.map((collection) => [collection.id, collection])
  );

  // Create the result array with all categories, including missing ones
  const result: Collection[] = [];

  // Process each category found in SPECIALS_RARITY
  cardsByCategory.forEach((cardNumbers, categoryId) => {
    const categoryIdNumber = parseInt(categoryId, 10);
    const existingCollection = existingCollections.get(categoryIdNumber);

    // Skip categories > 25 if player doesn't have any cards in that collection
    if (categoryIdNumber > 25 && !existingCollection) {
      return;
    }

    if (existingCollection) {
      // Collection exists, but might need additional cards
      const existingCards = new Map(
        existingCollection.cards.map((card) => [card.id, card])
      );

      // Add missing cards with empty userNfts arrays
      cardNumbers.forEach((cardNumber) => {
        const fullCardId = parseInt(`1${categoryId}${cardNumber}`, 10);
        if (!existingCards.has(fullCardId)) {
          existingCollection.cards.push({
            id: fullCardId,
            userNfts: [],
          });
        }
      });

      // Sort cards by ID before adding the collection
      existingCollection.cards.sort((a, b) => a.id - b.id);
      result.push(existingCollection);
    } else {
      // Create new collection for missing category
      const newCollection: Collection = {
        id: categoryIdNumber,
        cards: Array.from(cardNumbers).map((cardNumber) => ({
          id: parseInt(`1${categoryId}${cardNumber}`, 10),
          userNfts: [],
        })),
      };
      // Sort cards by ID
      newCollection.cards.sort((a, b) => a.id - b.id);
      result.push(newCollection);
    }
  });

  // Sort collections by ID
  result.sort((a, b) => a.id - b.id);

  return result;
}

export function fillTraditionalCollection(
  cards: NftCards[],
  startId: number,
  endId: number
): NftCards[] {
  if (
    !Number.isFinite(startId) ||
    !Number.isFinite(endId) ||
    startId > endId
  ) {
    throw new Error("fillTraditionalCollection: invalid range provided");
  }

  const cardMap = new Map<number, NftCards>();
  cards.forEach((card) => {
    if (Number.isFinite(card.id)) {
      cardMap.set(card.id, card);
    }
  });

  const result: NftCards[] = [];
  for (let cardId = startId; cardId <= endId; cardId += 1) {
    const card = cardMap.get(cardId);
    if (card) {
      result.push(card);
    } else {
      result.push({
        id: cardId,
        userNfts: [],
      });
    }
  }

  return result;
}
