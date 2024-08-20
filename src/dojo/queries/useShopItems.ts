import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { CardTypes, NumericCardTypes } from "../../enums/cardTypes";
import { Card } from "../../types/Card";
import { Pack } from "../../types/Pack";
import { useDojo } from "../useDojo";
import { useGame } from "./useGame";
import { useShop } from "./useShop";

export interface ShopItems {
  specialCards: Card[];
  modifierCards: Card[];
  commonCards: Card[];
  pokerHandItems: PokerHandItem[];
  packs: Pack[];
}

interface PokerHandItem {
  idx: number;
  poker_hand: string;
  level: number;
  cost: number;
  purchased: boolean;
}

const packs: Pack[] = [
  {
    id: "1",
    idx: 1,
    price: 200,
    img: "packs/basic.png",
    purchased: false,
    card_id: 1000,
    isPack: true,
  },
  {
    id: "2",
    idx: 2,
    name: "Advanced",
    price: 400,
    img: "packs/advanced.png",
    purchased: false,
    card_id: 1001,
    isPack: true,
  },
  {
    id: "3",
    idx: 3,
    name: "Jokers",
    price: 1500,
    img: "packs/jokers.png",
    purchased: false,
    card_id: 1002,
    isPack: true,
  },
];

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
  const shop = useShop();
  const gameId = game?.id ?? 0;

  const commonCardsIds = Array.from(
    { length: shop?.len_item_common_cards ?? 0 },
    (_, index) => index
  );

  const modifierCardsIds = Array.from(
    { length: shop?.len_item_modifier_cards ?? 0 },
    (_, index) => index
  );

  const specialCardsIds = Array.from(
    { length: shop?.len_item_special_cards ?? 0 },
    (_, index) => index
  );

  const commonCards: Card[] = commonCardsIds.map((index) =>
    useCard(gameId, index, NumericCardTypes.COMMON)
  );

  const modifierCards: Card[] = modifierCardsIds.map((index) =>
    useCard(gameId, index, NumericCardTypes.MODIFIER)
  );

  const specialCards: Card[] = specialCardsIds.map((index) =>
    useCard(gameId, index, NumericCardTypes.SPECIAL)
  );

  const pokerHandIds = Array.from(
    { length: shop?.len_item_poker_hands ?? 0 },
    (_, index) => index
  );

  const pokerHandItems: PokerHandItem[] = pokerHandIds.map((index) =>
    usePokerHandItem(gameId, index)
  );

  const shopItems: ShopItems = {
    specialCards: specialCards.sort(sortByCardId),
    modifierCards: modifierCards.sort(sortByCardId),
    commonCards: commonCards.sort(sortByCardId),
    pokerHandItems: pokerHandItems.sort(sortByPokerHand),
    packs,
  };

  return shopItems;
};
