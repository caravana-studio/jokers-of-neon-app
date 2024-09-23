import { Card } from "../../../types/Card";

export const preprocessCards = (cards: Card[]): Card[] => {
    const cardCountMap: { [key: string]: number } = {}; 
  
    return cards.map((card) => {
      if (card.id !== undefined) {
        const currentCount = cardCountMap[card.id] ?? 0;
        const newCount = currentCount + 1;
        cardCountMap[card.id] = newCount;
  
        return {
          ...card,
          id: `${card.id}-${newCount}`,
        };
      }
  
      return card;
    });
  };

export const createUsedCardsList = (fullDeck: Card[], currentDeck: Card[]): Card[] => {
    const usedCards: Card[] = [];
  
    fullDeck.forEach((card) => {
      const isCardUsed = !currentDeck.some(
        (currentCard) => currentCard.id === card.id
      );
      if (isCardUsed) {
        usedCards.push(card);
      }
    });
  
    return usedCards;
  };