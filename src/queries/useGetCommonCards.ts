import { useQuery } from "react-query";
import { Cards } from "../enums/cards";
import { Suits } from "../enums/suits";
import graphQLClient from "../graphQLClient";
import { Card } from "../types/Card";
import { zeroPad } from "../utils/zeroPad";
import { GET_COMMON_CARDS } from "./gqlQueries";

export const COMMON_CARD_QUERY_KEY = "common-cards";

interface CommonCardEdge {
  node: {
    idx: number;
    gameId: number;
    value: string;
    suit: string;
  };
}

interface CommonCardsResponse {
  playerCommonCardsModels: {
    edges: CommonCardEdge[];
  };
}

const fetchGraphQLData = async (
  gameId: number
): Promise<CommonCardsResponse> => {
  return await graphQLClient.request(GET_COMMON_CARDS, { gameId });
};

export const useGetCommonCards = (gameId: number) => {
  const queryResponse = useQuery<CommonCardsResponse>(
    [COMMON_CARD_QUERY_KEY, gameId],
    () => fetchGraphQLData(gameId)
  );
  const { data } = queryResponse;

  const dojoCommonCards = data?.playerCommonCardsModels?.edges;

  const cards: Card[] =
    dojoCommonCards?.map((edge) => {
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
    }) ?? [];
  return {
    ...queryResponse,
    data: cards,
  };
};
