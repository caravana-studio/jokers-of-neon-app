import { useQuery } from "react-query";
import graphQLClient from "../graphQLClient";
import { Card } from "../types/Card";
import { sortCards } from "../utils/sortCards";
import { GET_CURRENT_HAND_QUERY } from "./gqlQueries";
import { useGetCommonCards } from "./useGetCommonCards";

export const CURRENT_HAND_QUERY_KEY = "current-hand";

interface CardEdge {
  node: {
    game_id: number;
    idx: number;
    type_card: string;
    player_card_id: number;
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

export const useGetCurrentHand = (gameId: number, playerCommonCards: Card[]) => {
  const queryResponse = useQuery<CurrentHandResponse>(
    [CURRENT_HAND_QUERY_KEY, gameId],
    () => fetchGraphQLData(gameId),
    {enabled: playerCommonCards.length > 0}
  );
  const { data } = queryResponse;

  const cards: Card[] = filterDuplicates(
    data?.currentHandCardModels?.edges ?? []
  )
    .filter((edge) => {
      const dojoCard = edge.node;
      return !!playerCommonCards.find(
        (card) => card.idx === dojoCard.player_card_id
      );
    })
    .map((edge) => {
      const dojoCard = edge.node;
      const commonCard = playerCommonCards.find(
        (card) => card.idx === dojoCard.player_card_id
      )!;
      return { ...commonCard, idx: dojoCard.idx, id: dojoCard.idx.toString() };
    });

  return {
    ...queryResponse,
    data: sortCards(cards),
  };
};
