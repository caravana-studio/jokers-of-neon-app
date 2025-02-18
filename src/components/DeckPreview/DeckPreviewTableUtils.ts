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

const cardValuesMap: Map<Cards, string> = new Map([
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
  ]);

  const getTableData = (): TableData => {
    const deckCards = useDeck();
    const usedDeckCards = deckCards.fullDeckCards;
    const columnHeaders: ColumnHeader[] = [];
    const rowHeaders: RowHeader[] = [];
    const cells: Cell[][] = [];

    Array.from(cardValuesMap.keys()).forEach( cardValue =>
    {
        const quantity = usedDeckCards.filter(card => card.card === cardValue).length;
        columnHeaders.push({cardValue: cardValue, quantity: quantity});
    }
    )

    Array.from(cardSuitsMap.keys()).forEach( cardSuit =>
        {
            const quantity = usedDeckCards.filter(card => card.suit === cardSuit).length;
            rowHeaders.push({cardSuit: cardSuit, quantity: quantity});
        }
        )

    Array.from(cardSuitsMap.keys()).forEach(cardSuit => {
        const row: Cell[] = [];
        Array.from(cardValuesMap.keys()).forEach(cardValue => {
          const quantity = usedDeckCards.filter(card => card.card === cardValue && card.suit === cardSuit).length;
          row.push({ cardValue, cardSuit, quantity });
        });
        cells.push(row);
      });
    

    return {columnHeaders: columnHeaders, rowHeaders: rowHeaders, cells: cells}

  }
  
  export { cardValuesMap, cardSuitsMap, getTableData, type ColumnHeader, type RowHeader, type TableData };
  