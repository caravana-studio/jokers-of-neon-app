export type UserNft = {
  nftId: string;
  skin: number;
};

export type NftCards = {
  id: number;
  userNfts: UserNft[];
};

export type Collection = {
  id: string;
  cards: NftCards[];
};
