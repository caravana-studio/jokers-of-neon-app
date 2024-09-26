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
import { useComponentValue } from "@dojoengine/react";

const getCard = (game_id: number, idx: number, entity: Component) => {
  const entityId = getEntityIdFromKeys([
    BigInt(game_id),
    BigInt(idx),
  ]) as Entity;
  return getComponentValue(entity, entityId);
};

export const useCurrentHand = (sortBy: SortBy) => {
  const {
    setup: {
      clientComponents: { CurrentHandCard },
    },
  } = useDojo();

  console.log("CurrentHandCard", CurrentHandCard);

  const game = useGame();

  if (!game) return [];

  const handSize = game.len_hand;
  const dojoCards = [];

  for (let i = 0; i < handSize; i++) {
    console.log("GAME ID: ", game.id);
    dojoCards.push(getCard(game.id ?? 0, i, CurrentHandCard));
  }

  const cards: Card[] = dojoCards
    // filter out null cards (represented by card_id 9999)
    .filter((card) => card?.card_id !== 9999)
    .map((dojoCard) => {
      return {
        ...dojoCard,
        img: `${dojoCard?.card_id}.png`,
        isModifier: false,
        idx: dojoCard?.idx,
        id: dojoCard?.idx.toString(),
      };
    });

  const sortedCards = sortCards(cards, sortBy);
  return sortedCards;
};
