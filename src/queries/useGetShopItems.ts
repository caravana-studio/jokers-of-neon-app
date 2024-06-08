import gql from "graphql-tag";
import { useQuery } from "react-query";
import graphQLClient from "../graphQLClient";
import { ShopItem } from "../types/ShopItem";

export const SHOP_ITEMS_KEY = "round";

export const GET_SHOP_ITEMS_QUERY = gql`
  query GetShopItems($gameId: ID!) {
    cardItemModels(first: 30, where: { game_idEQ: $gameId }) {
      edges {
        node {
          cost
          card_id
          idx
          item_type
        }
      }
    }
  }
`;

interface ShopItemEdge {
  node: ShopItem;
}

interface ShopItemsResponse {
  cardItemModels: {
    edges: ShopItemEdge[];
  };
}

const fetchGraphQLData = async (gameId: number): Promise<ShopItemsResponse> => {
  return await graphQLClient.request(GET_SHOP_ITEMS_QUERY, { gameId });
};

export const useGetShopItems = (gameId: number) => {
  const queryResponse = useQuery<ShopItemsResponse>(
    [SHOP_ITEMS_KEY, gameId],
    () => fetchGraphQLData(gameId),
    {
      enabled: !!gameId,
    }
  );
  const { data } = queryResponse;

  const dojoShopItems = data?.cardItemModels?.edges.map((edge) => {
    return {
      price: edge.node.cost,
      isModifier: edge.node.item_type === "Modifier",
      isSpecial: edge.node.item_type === "Special",
      idx: edge.node.idx,
      card_id: edge.node.card_id,
      id: edge.node.idx.toString(),
      img: `${edge.node.item_type === "Common" ? "" : "effect/"}${edge.node.item_type === "Special" ? "special-" : ""}${edge.node.card_id}.png`,
    };
  });

  const specialCards = dojoShopItems?.filter((item) => item.isSpecial) ?? [];
  const modifierCards = dojoShopItems?.filter((item) => item.isModifier) ?? [];
  const commonCards =
    dojoShopItems?.filter((item) => !item.isSpecial && !item.isModifier) ?? [];

  const shopItems = {
    specialCards,
    modifierCards,
    commonCards,
  };

  return {
    ...queryResponse,
    data: shopItems,
  };
};
