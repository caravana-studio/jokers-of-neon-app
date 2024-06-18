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
  playerLevelPokerHandModels: {
    edges: PlaysEdge[];
  };
}

const fetchGraphQLData = async (): Promise<PlaysResponse> => {
  return await graphQLClient.request(GET_PLAYS_LEVEL_QUERY, {});
};

export const useGetPlaysLevelDetail = () => {
  const queryResponse = useQuery<PlaysResponse>(
    [PLAYS_LEVEL_QUERY_KEY],
    () => fetchGraphQLData(),
    {}
  );
  const { data } = queryResponse;

  const plays = data?.playerLevelPokerHandModels.edges.map((edge) => {
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
