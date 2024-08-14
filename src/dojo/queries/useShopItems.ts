import { useComponentValue } from "@dojoengine/react";
import {
  Entity
} from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { CardTypes, NumericCardTypes } from "../../enums/cardTypes";
import { Card } from "../../types/Card";
import { useDojo } from "../useDojo";
import { useGame } from "./useGame";

export interface ShopItems {
  specialCards: Card[];
  modifierCards: Card[];
  commonCards: Card[];
  pokerHandItems: PokerHandItem[];
}

interface PokerHandItem {
  idx: number;
  poker_hand: string;
  level: number;
  cost: number;
  purchased: boolean;
}

const sortByCardId = (a: Card, b: Card) => {
  return (a.card_id ?? 0) - (b.card_id ?? 0);
};
const sortByPokerHand = (a: PokerHandItem, b: PokerHandItem) => {
  return a.poker_hand.localeCompare(b.poker_hand);
};

const useCard = (gameId: number, index: number, type: NumericCardTypes) => {
  const {
    setup: {
      clientComponents: { CardItem },
    },
  } = useDojo();

  const entityId = getEntityIdFromKeys([
    BigInt(gameId),
    BigInt(index),
    BigInt(type),
  ]) as Entity;
  const card = useComponentValue(CardItem, entityId);
  return {
    ...card,
    price: card?.cost,
    isModifier: card?.item_type === CardTypes.MODIFIER,
    isSpecial: card?.item_type === CardTypes.SPECIAL,
    id: card?.idx.toString() ?? "",
    idx: card?.idx ?? 0,
    purchased: card?.purchased,
    img: `${card?.item_type === CardTypes.COMMON ? "" : "effect/"}${card?.card_id}.png`,
  };
};

const usePokerHandItem = (gameId: number, index: number) => {
  const {
    setup: {
      clientComponents: { PokerHandItem },
    },
  } = useDojo();

  const entityId = getEntityIdFromKeys([
    BigInt(gameId),
    BigInt(index),
  ]) as Entity;
  const item = useComponentValue(PokerHandItem, entityId) as any;
  return {
    game_id: item.game_id ?? 0,
    idx: item.idx ?? 0,
    poker_hand: item.poker_hand ?? "",
    level: item.level ?? 0,
    cost: item.cost ?? 200,
    purchased: item.purchased ?? false,
  };
};

export const useShopItems = () => {
  const game = useGame();
  const gameId = game?.id ?? 0;

  const tc1 = useCard(gameId, 0, NumericCardTypes.COMMON);
  const tc2 = useCard(gameId, 1, NumericCardTypes.COMMON);
  const tc3 = useCard(gameId, 2, NumericCardTypes.COMMON);
  const tc4 = useCard(gameId, 3, NumericCardTypes.COMMON);
  const tc5 = useCard(gameId, 4, NumericCardTypes.COMMON);

  const commonCards: Card[] = [tc1, tc2, tc3, tc4, tc5];

  const mc1 = useCard(gameId, 0, NumericCardTypes.MODIFIER);
  const mc2 = useCard(gameId, 1, NumericCardTypes.MODIFIER);
  const mc3 = useCard(gameId, 2, NumericCardTypes.MODIFIER);
  const mc4 = useCard(gameId, 3, NumericCardTypes.MODIFIER);

  const modifierCards: Card[] = [mc1, mc2, mc3, mc4];

  const sc1 = useCard(gameId, 0, NumericCardTypes.SPECIAL);
  const sc2 = useCard(gameId, 1, NumericCardTypes.SPECIAL);
  const sc3 = useCard(gameId, 2, NumericCardTypes.SPECIAL);

  const specialCards: Card[] = [sc1, sc2, sc3];

  const ph1 = usePokerHandItem(gameId, 0);
  const ph2 = usePokerHandItem(gameId, 1);
  const ph3 = usePokerHandItem(gameId, 2);

  const pokerHandItems: PokerHandItem[] = [ph1, ph2, ph3];

  const shopItems: ShopItems = {
    specialCards: specialCards.sort(sortByCardId),
    modifierCards: modifierCards.sort(sortByCardId),
    commonCards: commonCards.sort(sortByCardId),
    pokerHandItems: pokerHandItems.sort(sortByPokerHand),
  };

  return shopItems;
};
