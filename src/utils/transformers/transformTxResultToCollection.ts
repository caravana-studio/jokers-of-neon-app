import { Collection, NftCards, UserNft } from "../../pages/MyCollection/types";

type TxResultItem = {
  category_id: BigInt;
  quality: BigInt;
  skin_id: BigInt;
  skin_rarity: BigInt;
  special_id: BigInt;
  tier: BigInt;
  token_id: BigInt;
};

export const transformTxResultToCollection = (txResult: TxResultItem[]): Collection[] => {
  // Group by category_id (Collection id)
  const groupedByCategory = txResult.reduce<Record<number, TxResultItem[]>>((acc, item) => {
    const categoryId = Number(item.category_id);
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(item);
    return acc;
  }, {});

  // Transform into Collection array
  return Object.entries(groupedByCategory).map(([categoryId, items]): Collection => {
    // Group items by special_id (NftCards id)
    const groupedBySpecialId = items.reduce<Record<string, TxResultItem[]>>((acc, item) => {
      const specialId = item.special_id.toString();
      if (!acc[specialId]) {
        acc[specialId] = [];
      }
      acc[specialId].push(item);
      return acc;
    }, {});

    // Transform into NftCards array
    const cards: NftCards[] = Object.entries(groupedBySpecialId).map(([specialId, specialItems]): NftCards => {
      // Transform items into UserNft array
      const userNfts: UserNft[] = specialItems.map((item): UserNft => ({
        nftId: item.token_id.toString(),
        skin: Number(item.skin_id),
        quality: Number(item.quality),
      }));

      return {
        id: Number(specialId),
        userNfts,
      };
    });

    return {
      id: Number(categoryId),
      cards,
    };
  });
};
