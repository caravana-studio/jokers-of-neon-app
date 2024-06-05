import { useQuery } from "react-query";
import graphQLClient from "../graphQLClient";
import { Card } from "../types/Card";
import { sortCards } from "../utils/sortCards";
import { GET_CURRENT_HAND_QUERY } from "./gqlQueries";
import { useGetCommonCards } from "./useGetCommonCards";
import { useGetEffectCards } from "./useGetEffectCards";

export const CURRENT_HAND_QUERY_KEY = "current-hand";

interface CardEdge {
  node: {
    game_id: number;
    idx: number;
    type_player_card: string;
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

export const useGetCurrentHand = (gameId: number) => {
  const { data: playerCommonCards } = useGetCommonCards(gameId);
  const { data: playerEffectCards } = useGetEffectCards(gameId);

  const queryResponse = useQuery<CurrentHandResponse>(
    [CURRENT_HAND_QUERY_KEY, gameId],
    () => fetchGraphQLData(gameId),
    {
      enabled: playerCommonCards.length > 0,
      refetchInterval: 500, // Refetch every 100 milliseconds
      cacheTime: 0, // Disable caching
      staleTime: 0, // Make data stale immediately
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    }
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
      const effectCard = playerEffectCards.find(
        (card) => card.idx === dojoCard.player_card_id
      )!;
      const card =
        dojoCard.type_player_card === "Effect" ? effectCard : commonCard;
      return { ...card, idx: dojoCard.idx, id: dojoCard.idx.toString() };
    });

  const sortedCards = sortCards(cards);
  return {
    ...queryResponse,
    data: sortedCards,
  };
};
