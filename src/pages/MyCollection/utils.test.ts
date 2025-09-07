import { describe, it, expect } from 'vitest';
import { fillCollections } from './utils';
import { Collection } from './types';
import { SPECIALS_RARITY } from '../../data/specialCards';

describe('fillCollections', () => {
  it('should preserve existing collection data', () => {
    const input: Collection[] = [{
      id: 1,
      cards: [{
        id: 10101,
        userNfts: [{
          nftId: 'existing-nft',
          skin: 1
        }]
      }]
    }];

    const result = fillCollections(input);
    const season1 = result.find(c => c.id === 1);
    const card10101 = season1?.cards.find(c => c.id === 10101);

    expect(card10101?.userNfts).toHaveLength(1);
    expect(card10101?.userNfts[0].nftId).toBe('existing-nft');
  });

  it('should add missing cards with empty userNfts arrays', () => {
    const input: Collection[] = [{
      id: 1,
      cards: [{
        id: 10101,
        userNfts: [{
          nftId: 'existing-nft',
          skin: 1
        }]
      }]
    }];

    const result = fillCollections(input);
    const season1 = result.find(c => c.id === 1);
    
    // Count how many cards are in season 1 in SPECIALS_RARITY
    const season1Cards = Object.keys(SPECIALS_RARITY)
      .filter(id => id.startsWith('101'))
      .length;

    expect(season1?.cards).toHaveLength(season1Cards);
    
    // Check a card that wasn't in input has empty userNfts
    const newCard = season1?.cards.find(c => c.id !== 10101);
    expect(newCard?.userNfts).toHaveLength(0);
  });

  it('should skip season 0', () => {
    const result = fillCollections([]);
    
    // No collection should have id 0
    expect(result.find(c => c.id === 0)).toBeUndefined();
    
    // No cards should start with 100
    const season0Cards = result.flatMap(c => c.cards)
      .filter(card => String(card.id).startsWith('100'));
    expect(season0Cards).toHaveLength(0);
  });

  it('should sort collections and cards by id', () => {
    const input: Collection[] = [
      {
        id: 99,
        cards: [
          { id: 19902, userNfts: [] },
          { id: 19901, userNfts: [] }
        ]
      },
      {
        id: 1,
        cards: [
          { id: 10102, userNfts: [] },
          { id: 10101, userNfts: [] }
        ]
      }
    ];

    const result = fillCollections(input);

    // Collections should be sorted
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(99);

    // Cards within collections should be sorted
    expect(result[0].cards[0].id).toBe(10101);
    expect(result[0].cards[1].id).toBe(10102);
    expect(result[1].cards[0].id).toBe(19901);
    expect(result[1].cards[1].id).toBe(19902);
  });

  it('should create missing collections with all their cards (only for categories <= 25)', () => {
    // Start with empty input
    const result = fillCollections([]);

    // Get all unique category IDs from SPECIALS_RARITY (excluding season 0 and categories > 25)
    const categories = new Set(
      Object.keys(SPECIALS_RARITY)
        .map(id => parseInt(id.substring(1, 3)))
        .filter(id => id !== 0 && id <= 25)
    );

    // Each valid category should have a collection
    expect(result.length).toBe(categories.size);

    // Each collection should have all its cards from SPECIALS_RARITY
    result.forEach(collection => {
      const categoryId = String(collection.id).padStart(2, '0');
      const expectedCards = Object.keys(SPECIALS_RARITY)
        .filter(id => id.substring(1, 3) === categoryId);
      
      expect(collection.cards.length).toBe(expectedCards.length);
    });
  });

  it('should skip categories > 25 if player has no cards in them', () => {
    // Start with empty input
    const result = fillCollections([]);

    // No collection should have id > 25
    expect(result.find(c => c.id > 25)).toBeUndefined();

    // But if player has cards in a category > 25, it should be included
    const inputWithHighCategory: Collection[] = [{
      id: 99,
      cards: [{
        id: 19901,
        userNfts: [{
          nftId: 'existing-nft',
          skin: 1
        }]
      }]
    }];

    const resultWithHighCategory = fillCollections(inputWithHighCategory);
    const highCategory = resultWithHighCategory.find(c => c.id === 99);
    expect(highCategory).toBeDefined();
    expect(highCategory?.cards[0].userNfts[0].nftId).toBe('existing-nft');
  });
});
