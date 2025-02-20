import { FC, SVGProps, ReactSVGElement } from "react";
import { Cards } from "../../enums/cards";
import { Suits } from "../../enums/suits";
import { Icons } from "../../constants/icons";
import { useDeck } from "../../dojo/queries/useDeck";

interface ColumnHeader {
    cardValue?: Cards;
    quantity?: number;
}

interface RowHeader {
    cardSuit?: Suits;
    quantity?: number;
}

interface Cell {
    cardValue: Cards;
    cardSuit: Suits;
    quantity: number;
}

interface TableData {
    columnHeaders: ColumnHeader[];
    rowHeaders: RowHeader[];
    cells: Cell[][];
}

type CardValue = string | FC<SVGProps<ReactSVGElement>>;

const cardValuesMap: Map<Cards, CardValue> = new Map<Cards, CardValue>([
  [Cards.ACE, 'A'],
  [Cards.KING, 'K'],
  [Cards.QUEEN, 'Q'],
  [Cards.JACK, 'J'],
  [Cards.TEN, '10'],
  [Cards.NINE, '9'],
  [Cards.EIGHT, '8'],
  [Cards.SEVEN, '7'],
  [Cards.SIX, '6'],
  [Cards.FIVE, '5'],
  [Cards.FOUR, '4'],
  [Cards.THREE, '3'],
  [Cards.TWO, '2'],
]);

  const cardSuitsMap: Map<Suits, FC<SVGProps<ReactSVGElement>>> = new Map([
    [Suits.CLUBS, Icons.CLUB],
    [Suits.DIAMONDS, Icons.DIAMOND],
    [Suits.HEARTS, Icons.HEART],
    [Suits.SPADES, Icons.SPADE],
    [Suits.JOKER, Icons.JOKER],
  ]);

  const getTableData = (): TableData => {
    const {fullDeckCards, usedCards} = useDeck();
    const usedCardIds = new Set(usedCards.map(card => card.id));
    const deck = fullDeckCards.filter(card => !usedCardIds.has(card.id));

    const columnHeaders = Array.from(cardValuesMap.keys()).map(cardValue => ({
      cardValue,
      quantity: deck.filter(card => card.card === cardValue).length
    }));
  
    const rowHeaders = Array.from(cardSuitsMap.keys()).map(cardSuit => ({
      cardSuit,
      quantity: deck.filter(card => card.suit === cardSuit).length
    }));

    const cells = Array.from(cardSuitsMap.keys()).map(cardSuit =>
      Array.from(cardValuesMap.keys()).map(cardValue => ({
        cardValue,
        cardSuit,
        quantity: deck.filter(card => card.card === cardValue && card.suit === cardSuit).length
      }))
    );
    
    return {columnHeaders: columnHeaders, rowHeaders: rowHeaders, cells: cells}
  }
  
  export { cardValuesMap, cardSuitsMap, getTableData, type ColumnHeader, type RowHeader, type TableData };
  