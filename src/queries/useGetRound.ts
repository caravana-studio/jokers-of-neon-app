import { useQuery } from "react-query";
import graphQLClient from "../graphQLClient";
import { Round } from "../types/Round";
import { GET_ROUND_QUERY } from "./gqlQueries";

export const ROUND_QUERY_KEY = "round";

interface RoundEdge {
  node: {
    score: number,
    hands: number,
    discard: number
  };
}

interface RoundResponse {
  roundModels: {
    edges: RoundEdge[];
  };
}

const fetchGraphQLData = async (
  gameId: number
): Promise<RoundResponse> => {
  return await graphQLClient.request(GET_ROUND_QUERY, { gameId });
};


export const useGetRound = (gameId: number) => {
  const queryResponse = useQuery<RoundResponse>(
    [ROUND_QUERY_KEY, gameId],
    () => fetchGraphQLData(gameId),
    {
      // cacheTime: 0, // Immediately remove the query from the cache
      // staleTime: 0, // Always consider the data as stale
      // refetchOnMount: true, // Refetch on every mount
      // refetchOnWindowFocus: true, // Refetch on window focus
      // refetchInterval: 500,
    }
  );
  const { data } = queryResponse;

  const dojoRound = data?.roundModels?.edges[0]?.node

  const round: Round = {
    score: dojoRound?.score ?? 0,
    hands: dojoRound?.hands ?? 0,
    discards: dojoRound?.discard ?? 0
  }
  return {
    ...queryResponse,
    data: round,
  };
};
