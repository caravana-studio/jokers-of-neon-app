import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { Card } from "../../types/Card";
import { useDojo } from "../useDojo";
import { getCardFromCardId } from "../utils/getCardFromCardId";
import { useGame } from "./useGame";

const sort = (a: Card, b: Card) => {
  return (a.card_id ?? 0) - (b.card_id ?? 0);
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
  const cardsArray = (blisterPackResult?.cards ?? []).map(
    (card) => card && Number((card as any)?.value)
  );

  return {
    cards: getCards(cardsArray ?? []).sort(sort),
    cardsPicked: blisterPackResult?.cards_picked ?? false,
  };
};
