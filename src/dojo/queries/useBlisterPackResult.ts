import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "../useDojo";
import { getCardFromCardId } from "../utils/getCardFromCardId";
import { useGame } from "./useGame";

const sort = (a: number, b: number) => {
  return a - b;
};

const getCards = (cardIds: number[]) => {
  return cardIds.map((cardId, index) => {
    return getCardFromCardId(cardId, index);
  });
};

export const useBlisterPackResult = () => {
  const {
    setup: {
      clientComponents: { BlisterPackResult },
    },
  } = useDojo();

  const game = useGame();
  const gameId = game?.id ?? 0;

  const entityId = getEntityIdFromKeys([BigInt(gameId)]) as Entity;

  const blisterPackResult = useComponentValue(BlisterPackResult, entityId);
  const cardsArray = (blisterPackResult?.cards ?? [])
    .map((card) => Number(card))
    .sort(sort);

  return {
    cards: getCards(cardsArray ?? []),
    cardsPicked: blisterPackResult?.cards_picked ?? false,
  };
};
