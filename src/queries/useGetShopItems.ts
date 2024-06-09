import gql from "graphql-tag";
import { useQuery } from "react-query";
import { CardTypes } from "../enums/cardTypes";
import graphQLClient from "../graphQLClient";
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

interface ShopItemEdge {
  node: ShopItem;
}

interface PokerHandItemEdge {
  node: {
    idx: number;
    poker_hand: string;
    level: number;
    cost: number;
    purchased: boolean;
  };
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

export const useGetShopItems = (gameId: number, round: number, enabled = true) => {
  const queryResponse = useQuery<ShopItemsResponse>(
    [SHOP_ITEMS_KEY, gameId, round],
    () => fetchGraphQLData(gameId),
    {
      enabled: !!gameId && enabled,
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

  const pokerHandItems = data?.pokerHandItemModels?.edges.map((edge) => {
    return edge.node;
  });

  const specialCards = dojoShopItems?.filter((item) => item.isSpecial) ?? [];
  const modifierCards = dojoShopItems?.filter((item) => item.isModifier) ?? [];
  const commonCards =
    dojoShopItems?.filter((item) => !item.isSpecial && !item.isModifier) ?? [];

  const shopItems = {
    specialCards,
    modifierCards,
    commonCards,
    pokerHandItems
  };

  return {
    ...queryResponse,
    data: shopItems,
  };
};
