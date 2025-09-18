import { expect, test } from "vitest";
import { transformTxResultToCollection } from '../transformTxResultToCollection';

test('should transform a simple tx result into collections correctly', () => {
    const input = [
      {
        category_id: 1n,
        quality: 1n,
        skin_id: 1n,
        skin_rarity: 1n,
        special_id: 10020n,
        tier: 1n,
        token_id: 1n,
      }
    ];

    const result = transformTxResultToCollection(input);

    expect(result).toEqual([
      {
        id: 1,
        cards: [
          {
            id: 10020,
            userNfts: [
              {
                nftId: "1",
                skin: 1,
                quality: 1,
              }
            ]
          }
        ]
      }
    ]);
});

test('should group multiple NFTs with the same special_id into the same nftCard', () => {
    const input = [
      {
        category_id: 1n,
        quality: 1n,
        skin_id: 1n,
        skin_rarity: 1n,
        special_id: 10020n,
        tier: 1n,
        token_id: 1n,
      },
      {
        category_id: 1n,
        quality: 2n,
        skin_id: 2n,
        skin_rarity: 1n,
        special_id: 10020n,
        tier: 1n,
        token_id: 2n,
      }
    ];

    const result = transformTxResultToCollection(input);

    expect(result).toEqual([
      {
        id: 1,
        cards: [
          {
            id: 10020,
            userNfts: [
              {
                nftId: "1",
                skin: 1,
                quality: 1,
              },
              {
                nftId: "2",
                skin: 2,
                quality: 2,
              }
            ]
          }
        ]
      }
    ]);
});

test('should handle multiple categories and special ids', () => {
    const input = [
      {
        category_id: 1n,
        quality: 1n,
        skin_id: 1n,
        skin_rarity: 1n,
        special_id: 10020n,
        tier: 1n,
        token_id: 1n,
      },
      {
        category_id: 1n,
        quality: 2n,
        skin_id: 2n,
        skin_rarity: 1n,
        special_id: 10021n,
        tier: 1n,
        token_id: 2n,
      },
      {
        category_id: 2n,
        quality: 3n,
        skin_id: 1n,
        skin_rarity: 1n,
        special_id: 10030n,
        tier: 1n,
        token_id: 3n,
      }
    ];

    const result = transformTxResultToCollection(input);

    expect(result).toEqual([
      {
        id: 1,
        cards: [
          {
            id: 10020,
            userNfts: [
              {
                nftId: "1",
                skin: 1,
                quality: 1,
              }
            ]
          },
          {
            id: 10021,
            userNfts: [
              {
                nftId: "2",
                skin: 2,
                quality: 2,
              }
            ]
          }
        ]
      },
      {
        id: 2,
        cards: [
          {
            id: 10030,
            userNfts: [
              {
                nftId: "3",
                skin: 1,
                quality: 3,
              }
            ]
          }
        ]
      }
    ]);
});

test('should handle empty input', () => {
    const input: {
      category_id: bigint;
      quality: bigint;
      skin_id: bigint;
      skin_rarity: bigint;
      special_id: bigint;
      tier: bigint;
      token_id: bigint;
    }[] = [];

    const result = transformTxResultToCollection(input);

    expect(result).toEqual([]);
});

