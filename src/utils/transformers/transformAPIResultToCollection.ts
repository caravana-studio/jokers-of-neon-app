import type { UserCard } from "../../api/getUserCards";
import { Collection, NftCards, UserNft } from "../../pages/MyCollection/types";

const getCollectionIdFromCardId = (cardId: number): number | null => {
  if (!Number.isFinite(cardId)) {
    return null;
  }

  const cardIdString = cardId.toString();
  if (cardIdString.length < 3) {
    return null;
  }

  const collectionId = Number(cardIdString.slice(1, 3));
  return Number.isFinite(collectionId) ? collectionId : null;
};

export const transformAPIResultToCollection = (
  userCards: UserCard[]
): Collection[] => {
  const groupedByCardId = userCards.reduce<Record<number, UserCard[]>>(
    (acc, card) => {
      const cardId = Number(card.cardId);
      if (!Number.isFinite(cardId)) {
        return acc;
      }
      if (!acc[cardId]) {
        acc[cardId] = [];
      }
      acc[cardId].push(card);
      return acc;
    },
    {}
  );

  const groupedByCollection = Object.entries(groupedByCardId).reduce<
    Record<number, NftCards[]>
  >((acc, [cardIdKey, cardEntries]) => {
    const cardId = Number(cardIdKey);
    const collectionId = getCollectionIdFromCardId(cardId);
    if (collectionId === null) {
      return acc;
    }

    const userNfts: UserNft[] = cardEntries.map((entry): UserNft => ({
      nftId: entry.tokenId,
      skin: entry.skinId,
      quality: entry.quality,
    }));

    if (!acc[collectionId]) {
      acc[collectionId] = [];
    }

    acc[collectionId].push({
      id: cardId,
      userNfts,
    });

    return acc;
  }, {});

  return Object.entries(groupedByCollection)
    .map(
      ([collectionIdKey, cards]): Collection => ({
        id: Number(collectionIdKey),
        cards: cards.sort((a, b) => a.id - b.id),
      })
    )
    .sort((a, b) => a.id - b.id);
};
