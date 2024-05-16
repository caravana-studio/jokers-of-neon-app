import { useQuery } from "react-query";
import { Cards } from "../enums/cards";
import { Suits } from "../enums/suits";
import graphQLClient from "../graphQLClient";
import { Card } from "../types/Card";
import { sortCards } from "../utils/sortCards";
import { zeroPad } from "../utils/zeroPad";
import { GET_CURRENT_HAND_QUERY } from "./gqlQueries";

export const CURRENT_HAND_QUERY_KEY = "current-hand";

interface CardEdge {
  node: {
    game_id: number;
    idx: number;
    suit: string;
    type_card: string;
    value: string;
  };
}

interface CurrentHandResponse {
  currentHandCardModels: {
    edges: CardEdge[];
  };
}

const fetchGraphQLData = async (
  gameId: number
): Promise<CurrentHandResponse> => {
  return await graphQLClient.request(GET_CURRENT_HAND_QUERY, { gameId });
};

const filterDuplicates = (data: CardEdge[]): CardEdge[] => {
  const seen = new Set();
  return data.filter((item) => {
    const node = item.node;
    const duplicate = seen.has(node.idx);
    seen.add(node.idx);
    return !duplicate;
  });
};

export const useGetCurrentHand = (gameId: number) => {
  const queryResponse = useQuery<CurrentHandResponse>(
    [CURRENT_HAND_QUERY_KEY, gameId],
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

  const cards: Card[] = filterDuplicates(
    data?.currentHandCardModels?.edges ?? []
  ).map((edge) => {
    const dojoCard = edge.node;
    const value = Cards[dojoCard!.value.toUpperCase() as keyof typeof Cards];
    const suit = Suits[dojoCard!.suit.toUpperCase() as keyof typeof Suits];
    const img = `${dojoCard!.suit.charAt(0)}${zeroPad(value, 2)}.png`;
    return {
      id: dojoCard!.idx.toString(),
      value,
      idx: dojoCard!.idx,
      suit,
      img,
    };
  });

  return {
    ...queryResponse,
    data: sortCards(cards),
  };
};
