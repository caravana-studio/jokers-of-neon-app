import { useComponentValue } from "@dojoengine/react";
import { Component, Entity, getComponentValue } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { SortBy } from "../../enums/sortBy";
import { Card } from "../../types/Card";
import { sortCards } from "../../utils/sortCards";
import { useDojo } from "../useDojo";
import { getLSGameId } from "../utils/getLSGameId";

export const getCard = (gameId: number, index: number, entity: Component) => {
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

  const gameId = getLSGameId();
  const entityId = getEntityIdFromKeys([BigInt(gameId ?? 0)]) as Entity;
  const currentHand = useComponentValue(CurrentHand, entityId);
  console.log("currentHand", currentHand);
  if (gameId === undefined || gameId === null) return [];

  const dojoCards = currentHand?.cards ?? [];

  const cards: Card[] = dojoCards.map((card: any, index: number) => {
    const card_id = card.value;
    return {
      card_id,
      img: `${card_id}.png`,
      isModifier: card_id >= 600 && card_id <= 700,
      idx: index,
      id: index.toString(),
    };
  });

  const sortedCards = sortCards(cards, sortBy);
  return sortedCards;
};
