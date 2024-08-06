import {
  Entity,
  getComponentValue,
  OverridableComponent,
} from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { CardTypes, NumericCardTypes } from "../../enums/cardTypes";
import { Card } from "../../types/Card";
import { useDojo } from "../useDojo";
import { useGame } from "./useGame";
import { useShop } from "./useShop";

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

const getCard = (
  gameId: number,
  index: number,
  type: NumericCardTypes,
  entity: OverridableComponent
) => {
  const entityId = getEntityIdFromKeys([
    BigInt(gameId),
    BigInt(index),
    BigInt(type),
  ]) as Entity;
  const card = getComponentValue(entity, entityId);
  console.log("card", card);
  return (
    card && {
      ...card,
      price: card.cost,
      isModifier: card.item_type === CardTypes.MODIFIER,
      isSpecial: card.item_type === CardTypes.SPECIAL,
      id: card.idx.toString(),
      idx: card.idx,
      purchased: card.purchased,
      img: `${card.item_type === CardTypes.COMMON ? "" : "effect/"}${card.card_id}.png`,
    }
  );
};

export const useShopItems = () => {
  const {
    setup: {
      clientComponents: { CardItem, PokerHandItem },
    },
  } = useDojo();

  const shop = useShop();
  const game = useGame();
  const gameId = game?.id ?? 0;

  const commonCardsLength = shop?.len_item_common_cards ?? 0;
  const modifierCardsLength = shop?.len_item_modifier_cards ?? 0;
  const specialCardsLength = shop?.len_item_special_cards ?? 0;
  const pokerPlaysLength = shop?.len_item_poker_hands ?? 0;

  const commonCards: Card[] = [];
  const modifierCards: Card[] = [];
  const specialCards: Card[] = [];

  for (let i = 0; i < commonCardsLength; i++) {
    const card = getCard(gameId, i, NumericCardTypes.COMMON, CardItem);
    card && commonCards.push(card);
  }
  for (let i = 0; i < modifierCardsLength; i++) {
    const card = getCard(gameId, i, NumericCardTypes.MODIFIER, CardItem);
    card && modifierCards.push(card);
  }
  for (let i = 0; i < specialCardsLength; i++) {
    const card = getCard(gameId, i, NumericCardTypes.SPECIAL, CardItem);
    card && specialCards.push(card);
  }

  const pokerHandItems = [];

  for (let i = 0; i < pokerPlaysLength; i++) {
    const entityId = getEntityIdFromKeys([BigInt(gameId), BigInt(i)]) as Entity;
    const item = getComponentValue(PokerHandItem, entityId) as any;
    pokerHandItems.push(item);
  }

  const shopItems: ShopItems = {
    specialCards: specialCards.sort(sortByCardId),
    modifierCards: modifierCards.sort(sortByCardId),
    commonCards: commonCards.sort(sortByCardId),
    pokerHandItems: pokerHandItems.sort(sortByPokerHand),
  };

  return shopItems;
};
