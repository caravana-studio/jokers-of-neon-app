import type { UserCard } from "../../api/getUserCards";
import { NftCards, UserNft } from "../../pages/MyCollection/types";

export const transformAPIResultToTraditionalCollection = (
  userCards: UserCard[]
): NftCards[] => {
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

  const cards: NftCards[] = [];

  Object.entries(groupedByCardId).forEach(([cardIdKey, cardEntries]) => {
    const cardId = Number(cardIdKey);
    if (!Number.isFinite(cardId)) {
      return;
    }

    const userNfts: UserNft[] = cardEntries.map(
      (entry): UserNft => ({
        nftId: entry.tokenId,
        skin: entry.skinId,
        quality: entry.quality,
      })
    );

    cards.push({
      id: cardId,
      userNfts,
    });
  });

  cards.sort((a, b) => a.id - b.id);

  return cards;
};
