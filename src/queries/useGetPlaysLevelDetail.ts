import { useQuery } from "react-query";
import graphQLClient from "../graphQLClient";
import { GET_PLAYS_LEVEL_QUERY } from "./gqlQueries"
import { PokerPlay } from '../types/PokerPlay'
import { parseHand } from '../enums/hands.ts'

export const PLAYS_LEVEL_QUERY_KEY = "playerLevelPokerHandModels";

interface PlaysEdge {
  node: {
    poker_hand: string,
    level: number,
    multi: number,
    points: number
  };
}

interface PlaysResponse {
  jokersOfNeonPlayerLevelPokerHandModels: {
    edges: PlaysEdge[];
  };
}

const fetchGraphQLData = async (
  gameId: number
): Promise<PlaysResponse> => {
  return await graphQLClient.request(GET_PLAYS_LEVEL_QUERY, { gameId });
};

export const useGetPlaysLevelDetail = (gameId: number) => {
  const queryResponse = useQuery<PlaysResponse>(
    [PLAYS_LEVEL_QUERY_KEY, gameId],
    () => fetchGraphQLData(gameId),
    {}
  );
  const { data } = queryResponse;

  const plays = data?.jokersOfNeonPlayerLevelPokerHandModels.edges.map((edge) => {
    const play: PokerPlay = {
      pokerHand: parseHand(edge.node.poker_hand),
      level: edge.node.level,
      multi: edge.node.multi,
      points: edge.node.points
    };
    return play;
  }).sort((a, b) => a.pokerHand.order - b.pokerHand.order);

  return {
    ...queryResponse,
    data: plays,
  };
};
