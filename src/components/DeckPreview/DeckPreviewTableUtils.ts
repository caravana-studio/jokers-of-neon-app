import { FC, ReactSVGElement, SVGProps } from "react";
import { Icons } from "../../constants/icons";
import { Cards } from "../../enums/cards";
import { Suits } from "../../enums/suits";
import { useDeckStore } from "../../state/useDeckStore";

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
const cardValuesMap: Map<Cards, string> = new Map<Cards, string>([
  [Cards.ACE, "A"],
  [Cards.KING, "K"],
  [Cards.QUEEN, "Q"],
  [Cards.JACK, "J"],
  [Cards.TEN, "10"],
  [Cards.NINE, "9"],
  [Cards.EIGHT, "8"],
  [Cards.SEVEN, "7"],
  [Cards.SIX, "6"],
  [Cards.FIVE, "5"],
  [Cards.FOUR, "4"],
  [Cards.THREE, "3"],
  [Cards.TWO, "2"],
]);

const cardSuitsMap: Map<Suits, string | FC<SVGProps<ReactSVGElement>>> =
  new Map([
    [Suits.CLUBS, Icons.CLUB],
    [Suits.DIAMONDS, Icons.DIAMOND],
    [Suits.HEARTS, Icons.HEART],
    [Suits.SPADES, Icons.SPADE],
    [Suits.JOKER, Icons.JOKER],
  ]);

const getTableData = (): TableData => {
  const { unusedCards } = useDeckStore();

  const columnHeaders = Array.from(cardValuesMap.keys()).map((cardValue) => ({
    cardValue,
    quantity: unusedCards.filter((card) => card.card === cardValue).length,
  }));

  const rowHeaders = Array.from(cardSuitsMap.keys()).map((cardSuit) => ({
    cardSuit,
    quantity: unusedCards.filter((card) => card.suit === cardSuit).length,
  }));

  const cells = Array.from(cardSuitsMap.keys()).map((cardSuit) =>
    Array.from(cardValuesMap.keys()).map((cardValue) => ({
      cardValue,
      cardSuit,
      quantity: unusedCards.filter(
        (card) => card.card === cardValue && card.suit === cardSuit
      ).length,
    }))
  );

  return { columnHeaders: columnHeaders, rowHeaders: rowHeaders, cells: cells };
};

export {
  cardSuitsMap, cardValuesMap, getTableData,
  type ColumnHeader,
  type RowHeader,
  type TableData
};

