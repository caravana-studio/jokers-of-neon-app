import { expect, test } from "vitest";
import type { UserCard } from "../../../api/getUserCards";
import { transformAPIResultToCollection } from "../transformAPIResultToCollection";

test("groups cards by rarity with a single entry", () => {
  const input: UserCard[] = [
    {
      tokenId: "145",
      marketable: false,
      cardId: 10109,
      rarity: 1,
      count: 0,
      owner: "0x123",
      skinId: 1,
      skinRarity: 0,
      quality: 7,
    },
  ];

  const result = transformAPIResultToCollection(input);

  expect(result).toEqual([
    {
      id: 1,
      cards: [
        {
          id: 10109,
          userNfts: [
            {
              nftId: "145",
              skin: 1,
              quality: 7,
            },
          ],
        },
      ],
    },
  ]);
});

test("groups multiple entries with the same cardId into one card", () => {
  const input: UserCard[] = [
    {
      tokenId: "145",
      marketable: false,
      cardId: 10109,
      rarity: 1,
      count: 0,
      owner: "0x123",
      skinId: 1,
      skinRarity: 0,
      quality: 7,
    },
    {
      tokenId: "146",
      marketable: false,
      cardId: 10109,
      rarity: 1,
      count: 0,
      owner: "0x123",
      skinId: 2,
      skinRarity: 0,
      quality: 10,
    },
  ];

  const result = transformAPIResultToCollection(input);

  expect(result).toEqual([
    {
      id: 1,
      cards: [
        {
          id: 10109,
          userNfts: [
            {
              nftId: "145",
              skin: 1,
              quality: 7,
            },
            {
              nftId: "146",
              skin: 2,
              quality: 10,
            },
          ],
        },
      ],
    },
  ]);
});

test("handles multiple rarities and card ids", () => {
  const input: UserCard[] = [
    {
      tokenId: "145",
      marketable: false,
      cardId: 10109,
      rarity: 1,
      count: 0,
      owner: "0x123",
      skinId: 1,
      skinRarity: 0,
      quality: 7,
    },
    {
      tokenId: "146",
      marketable: false,
      cardId: 10108,
      rarity: 1,
      count: 0,
      owner: "0x123",
      skinId: 1,
      skinRarity: 0,
      quality: 10,
    },
    {
      tokenId: "147",
      marketable: true,
      cardId: 10209,
      rarity: 2,
      count: 0,
      owner: "0x123",
      skinId: 3,
      skinRarity: 1,
      quality: 5,
    },
  ];

  const result = transformAPIResultToCollection(input);

  expect(result).toEqual([
    {
      id: 1,
      cards: [
        {
          id: 10108,
          userNfts: [
            {
              nftId: "146",
              skin: 1,
              quality: 10,
            },
          ],
        },
        {
          id: 10109,
          userNfts: [
            {
              nftId: "145",
              skin: 1,
              quality: 7,
            },
          ],
        },
      ],
    },
    {
      id: 2,
      cards: [
        {
          id: 10209,
          userNfts: [
            {
              nftId: "147",
              skin: 3,
              quality: 5,
            },
          ],
        },
      ],
    },
  ]);
});

test("returns an empty collection list when no cards are provided", () => {
  const input: UserCard[] = [];

  const result = transformAPIResultToCollection(input);

  expect(result).toEqual([]);
});
