import { gql } from "graphql-tag";
import { useQuery } from "react-query";
import graphQLClient from "../graphQLClient";

export const STORE_QUERY_KEY = "store";

export const STORE_QUERY = gql`
  query GetStore($gameId: ID!) {
    shopModels(where: { game_idEQ: $gameId }) {
      edges {
        node {
          reroll_cost
          reroll_executed
          len_item_common_cards
          len_item_modifier_cards
          len_item_special_cards
          len_item_poker_hands
        }
      }
    }
  }
`;

interface StoreEdge {
  node: {
    reroll_cost: number;
    reroll_executed: boolean;
    len_item_common_cards: number;
    len_item_modifier_cards: number;
    len_item_special_cards: number;
    len_item_poker_hands: number;
  };
}

interface StoreResponse {
  shopModels: {
    edges: StoreEdge[];
  };
}

const fetchGraphQLData = async (id: number): Promise<StoreResponse> => {
  return await graphQLClient.request(STORE_QUERY, { gameId: id });
};

export const useGetStore = (id: number) => {
  const queryResponse = useQuery<StoreResponse>([STORE_QUERY_KEY, id], () =>
    fetchGraphQLData(id)
  );
  const { data } = queryResponse;

  const store = data?.shopModels?.edges[0]?.node;

  return {
    ...queryResponse,
    data: store,
  };
};
