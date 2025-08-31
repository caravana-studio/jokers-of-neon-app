export type UserNft = {
  nftId: string;
  skin: number;
  quality?: number;
};

export type NftCards = {
  id: number;
  userNfts: UserNft[];
};

export type Collection = {
  id: number;
  cards: NftCards[];
};
