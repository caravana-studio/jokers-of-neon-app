import { gql } from "graphql-tag";
import { useQuery } from "react-query";
import { parseHand } from "../enums/hands.ts";
import graphQLClient from "../graphQLClient";
import { PokerPlay } from "../types/PokerPlay";

export const PLAYS_LEVEL_QUERY_KEY = "playerLevelPokerHandModels";

const GET_PLAYS_LEVEL_QUERY = gql`
  query GetLevelPokerHand($gameId: ID!) {
    jonSepoliaPlayerLevelPokerHandModels(
      first: 30
      where: { game_idEQ: $gameId }
    ) {
      edges {
        node {
          poker_hand
          level
          multi
          points
        }
      }
    }
  }
`;

interface PlaysEdge {
  node: {
    poker_hand: string;
    level: number;
    multi: number;
    points: number;
  };
}

interface PlaysResponse {
  jonSepoliaPlayerLevelPokerHandModels: {
    edges: PlaysEdge[];
  };
}

const fetchGraphQLData = async (gameId: number): Promise<PlaysResponse> => {
  return await graphQLClient.request(GET_PLAYS_LEVEL_QUERY, { gameId });
};

export const useGetPlaysLevelDetail = (gameId: number) => {
  const queryResponse = useQuery<PlaysResponse>(
    [PLAYS_LEVEL_QUERY_KEY, gameId],
    () => fetchGraphQLData(gameId),
    {}
  );
  const { data } = queryResponse;

  const plays = data?.jonSepoliaPlayerLevelPokerHandModels.edges
    .map((edge) => {
      const play: PokerPlay = {
        pokerHand: parseHand(edge.node.poker_hand),
        level: edge.node.level,
        multi: edge.node.multi,
        points: edge.node.points,
      };
      return play;
    })
    .sort((a, b) => a.pokerHand.order - b.pokerHand.order);

  return {
    ...queryResponse,
    data: plays,
  };
};
