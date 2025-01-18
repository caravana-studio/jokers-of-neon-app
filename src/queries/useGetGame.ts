import { gql } from "graphql-tag";
import { useQuery } from "react-query";
import graphQLClient from "../graphQLClient";

export const GAME_QUERY_KEY = "game";

export const GAME_QUERY = gql`
  query GetGame($gameId: ID!) {
    jokersOfNeonGameModels(where: { idEQ: $gameId }) {
      edges {
        node {
          cash
          state
          round
          player_score
          owner
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
    player_score: number;
    owner: string;
  };
}

interface GameResponse {
  jokersOfNeonGameModels: {
    edges: GameEdge[];
  };
}

const fetchGraphQLData = async (id: number): Promise<GameResponse> => {
  return await graphQLClient.request(GAME_QUERY, { gameId: id });
};

export const useGetGame = (id: number, refetching: boolean = false) => {
  const queryResponse = useQuery<GameResponse>([GAME_QUERY_KEY, id], () =>
    fetchGraphQLData(id),
  {
    refetchInterval: refetching ? 500 : undefined,
  }
  );
  const { data } = queryResponse;

  const game = data?.jokersOfNeonGameModels?.edges[0]?.node;

  return {
    ...queryResponse,
    data: game,
  };
};
