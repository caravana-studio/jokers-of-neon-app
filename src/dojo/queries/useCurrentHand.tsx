import { Component, Entity, getComponentValue } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useEffect, useState } from "react";
import { SortBy } from "../../enums/sortBy";
import { useGameStore } from "../../state/useGameStore";
import { Card } from "../../types/Card";
import { sortCards } from "../../utils/sortCards";
import { useDojo } from "../useDojo";

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

  const { id } = useGameStore();
  const [sortedCards, setSortedCards] = useState<Card[]>([]);

  const loadCurrentHand = () => {
    const entityId = getEntityIdFromKeys([BigInt(id ?? 0)]) as Entity;
    const currentHand = getComponentValue(CurrentHand, entityId);

    if (id === undefined || id === null) return; // <-- fix: no return value

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

    setSortedCards(sortCards(cards, sortBy));
  };

  useEffect(() => {
    loadCurrentHand();

    if (sortedCards.length === 0) {
      const retryTimeout = setTimeout(() => {
        loadCurrentHand();
      }, 1000);

      return () => clearTimeout(retryTimeout);
    }
  }, [id]);

  return sortedCards;
};
