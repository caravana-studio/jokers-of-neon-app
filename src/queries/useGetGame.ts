import { gql } from "graphql-tag";
import { useQuery } from "react-query";
import graphQLClient from "../graphQLClient";

export const GAME_QUERY_KEY = "game";

export const GAME_QUERY = gql`
  query GetGame($gameId: ID!) {
    gameModels(where: { idEQ: $gameId }) {
      edges {
        node {
          cash
          state
          round
          len_max_current_special_cards
          len_current_special_cards
        }
      }
    }
  }
`;

interface GameEdge {
  node: {
    cash: number;
    state: string;
    round: number;
    len_max_current_special_cards: number;
    len_current_special_cards: number;
  };
}

interface GameResponse {
  gameModels: {
    edges: GameEdge[];
  };
}

const fetchGraphQLData = async (id: number): Promise<GameResponse> => {
  return await graphQLClient.request(GAME_QUERY, { gameId: id });
};

export const useGetGame = (id: number) => {
  const queryResponse = useQuery<GameResponse>([GAME_QUERY_KEY, id], () =>
    fetchGraphQLData(id)
  );
  const { data } = queryResponse;

  const game = data?.gameModels?.edges[0]?.node;

  return {
    ...queryResponse,
    data: game,
  };
};
