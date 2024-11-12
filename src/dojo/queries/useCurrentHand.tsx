import {
  Component,
  Entity,
  getComponentValue
} from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { SortBy } from "../../enums/sortBy";
import { Card } from "../../types/Card";
import { sortCards } from "../../utils/sortCards";
import { useDojo } from "../useDojo";
import { useGame } from "./useGame";

const getCurrentHandCards = (gameId: number, entity: Component) => {
  const entityId = getEntityIdFromKeys([
    BigInt(gameId),
  ]) as Entity;
  return getComponentValue(entity, entityId);
}

const getCard = (gameId: number, index: number, entity: Component) => {
  const entityId = getEntityIdFromKeys([
    BigInt(gameId),
    BigInt(index),
  ]) as Entity;
  return getComponentValue(entity, entityId);
};

export const useCurrentHand = (sortBy: SortBy) => {
  const {
    setup: {
      clientComponents: { CurrentHand },
    },
  } = useDojo();

  const game = useGame();

  if (!game) return [];

  const dojoCards = getCurrentHandCards(game.id ?? 0, CurrentHand)?.cards ?? [];

  console.log("dojoCards: ", dojoCards);
  const cards: Card[] = dojoCards
    // Filter out null cards (where card_id is represented by the value 9999)
    .filter((card: any) => card.value !== 9999)
    .map((dojoCard: any, idx: number) => {
      const cardId = dojoCard.value; // Extract card_id from value
      return {
        ...dojoCard,
        card_id: cardId,
        img: `${cardId}.png`,
        isModifier: cardId >= 600 && cardId <= 700,
        idx: idx, // Using index if `idx` is not already defined in dojoCard
        id: idx.toString(),
      };
    });
  
  console.log("Filtered and mapped cards: ", cards);
  const sortedCards = sortCards(cards, sortBy);
  console.log("sortedCards: ", sortedCards);

  return sortedCards;
};
