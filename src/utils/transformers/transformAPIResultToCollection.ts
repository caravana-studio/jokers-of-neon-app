import type { UserCard } from "../../api/getUserCards";
import { Collection, NftCards, UserNft } from "../../pages/MyCollection/types";

export const transformAPIResultToCollection = (
  userCards: UserCard[]
): Collection[] => {
  const groupedByRarity = userCards.reduce<Record<number, UserCard[]>>(
    (acc, card) => {
      const rarity = Number(card.rarity);
      if (!Number.isFinite(rarity)) {
        return acc;
      }
      if (!acc[rarity]) {
        acc[rarity] = [];
      }
      acc[rarity].push(card);
      return acc;
    },
    {}
  );

  return Object.entries(groupedByRarity).map(
    ([rarityKey, rarityCards]): Collection => {
      const groupedByCardId = rarityCards.reduce<Record<number, UserCard[]>>(
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

      const cards: NftCards[] = Object.entries(groupedByCardId).map(
        ([cardIdKey, cardEntries]): NftCards => {
          const userNfts: UserNft[] = cardEntries.map((entry): UserNft => ({
            nftId: entry.tokenId,
            skin: entry.skinId,
            quality: entry.quality,
          }));

          return {
            id: Number(cardIdKey),
            userNfts,
          };
        }
      );

      return {
        id: Number(rarityKey),
        cards,
      };
    }
  );
};
