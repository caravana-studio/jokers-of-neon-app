import { useQuery } from "react-query";
import graphQLClient from "../graphQLClient";
import { Round } from "../types/Round";
import { GET_ROUND_QUERY } from "./gqlQueries";

export const ROUND_QUERY_KEY = "round";

interface RoundEdge {
  node: {
    player_score: number;
    level_score: number;
    hands: number;
    discard: number;
    current_len_deck: number;
  };
}

interface RoundResponse {
  roundModels: {
    edges: RoundEdge[];
  };
}

const fetchGraphQLData = async (gameId: number): Promise<RoundResponse> => {
  return await graphQLClient.request(GET_ROUND_QUERY, { gameId });
};

export const useGetRound = (gameId: number) => {
  const queryResponse = useQuery<RoundResponse>([ROUND_QUERY_KEY, gameId], () =>
    fetchGraphQLData(gameId)
  );
  const { data } = queryResponse;

  const dojoRound = data?.roundModels?.edges[0]?.node;

  const round: Round = {
    score: dojoRound?.player_score ?? 0,
    hands: dojoRound?.hands ?? 0,
    discards: dojoRound?.discard ?? 0,
    levelScore: dojoRound?.level_score ?? 0,
    deckLength: dojoRound?.current_len_deck ?? 0,
  };
  return {
    ...queryResponse,
    data: round,
  };
};
