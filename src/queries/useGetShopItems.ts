import gql from "graphql-tag";
import { useQuery } from "react-query";
import { CardTypes } from "../enums/cardTypes";
import graphQLClient from "../graphQLClient";
import { Card } from "../types/Card";
import { ShopItem } from "../types/ShopItem";

export const SHOP_ITEMS_KEY = "shop-items";

export const GET_SHOP_ITEMS_QUERY = gql`
  query GetShopItems($gameId: ID!) {
    cardItemModels(first: 30, where: { game_idEQ: $gameId }) {
      edges {
        node {
          cost
          card_id
          idx
          item_type
          purchased
        }
      }
    }
    pokerHandItemModels(first: 30, where: { game_idEQ: $gameId }) {
      edges {
        node {
          idx
          poker_hand
          level
          cost
          purchased
        }
      }
    }
  }
`;

export interface ShopItems {
  specialCards: Card[];
  modifierCards: Card[];
  commonCards: Card[];
  pokerHandItems: PokerHandItem[];
}

interface ShopItemEdge {
  node: ShopItem;
}

interface PokerHandItem {
  idx: number;
  poker_hand: string;
  level: number;
  cost: number;
  purchased: boolean;
}

interface PokerHandItemEdge {
  node: PokerHandItem;
}

interface ShopItemsResponse {
  cardItemModels: {
    edges: ShopItemEdge[];
  };
  pokerHandItemModels: {
    edges: PokerHandItemEdge[];
  };
}

const fetchGraphQLData = async (gameId: number): Promise<ShopItemsResponse> => {
  return await graphQLClient.request(GET_SHOP_ITEMS_QUERY, { gameId });
};

const sortByCardId = (a: Card, b: Card) => {
  return (a.card_id ?? 0) - (b.card_id ?? 0);
};
const sortByPokerHand = (a: PokerHandItem, b: PokerHandItem) => {
  return a.poker_hand.localeCompare(b.poker_hand);
};

export const useGetShopItems = (
  gameId: number,
  round: number,
  enabled = true
) => {
  const queryResponse = useQuery<ShopItemsResponse>(
    [SHOP_ITEMS_KEY, gameId, round],
    () => fetchGraphQLData(gameId),
    {
      enabled: !!gameId && enabled && !!round,
      refetchInterval: 500,
      cacheTime: 0, // Disable caching
      staleTime: 0, // Make data stale immediately
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    }
  );
  const { data } = queryResponse;

  const dojoShopItems = data?.cardItemModels?.edges.map((edge) => {
    return {
      price: edge.node.cost,
      isModifier: edge.node.item_type === CardTypes.MODIFIER,
      isSpecial: edge.node.item_type === CardTypes.SPECIAL,
      idx: edge.node.idx,
      card_id: edge.node.card_id,
      id: edge.node.idx.toString(),
      img: `${edge.node.item_type === CardTypes.COMMON ? "" : "effect/"}${edge.node.card_id}.png`,
      purchased: edge.node.purchased,
    };
  });

  const pokerHandItems =
    data?.pokerHandItemModels?.edges
      .map((edge) => {
        return edge.node;
      })
      ?.sort(sortByPokerHand) ?? [];

  const specialCards =
    dojoShopItems?.filter((item) => item.isSpecial)?.sort(sortByCardId) ?? [];
  const modifierCards =
    dojoShopItems?.filter((item) => item.isModifier)?.sort(sortByCardId) ?? [];
  const commonCards =
    dojoShopItems
      ?.filter((item) => !item.isSpecial && !item.isModifier)
      ?.sort(sortByCardId) ?? [];

  const shopItems: ShopItems = {
    specialCards,
    modifierCards,
    commonCards,
    pokerHandItems,
  };

  return {
    ...queryResponse,
    data: shopItems,
  };
};
