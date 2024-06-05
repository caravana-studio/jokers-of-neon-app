import { useQuery } from "react-query";
import graphQLClient from "../graphQLClient";
import { Card } from "../types/Card";
import { getEnvNumber } from "../utils/getEnvValue";
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

const REFETCH_HAND_INTERVAL_ACTIVE =
  getEnvNumber("VITE_REFETCH_HAND_INTERVAL_ACTIVE") || 100;
const REFETCH_HAND_INTERVAL_INACTIVE =
  getEnvNumber("VITE_REFETCH_HAND_INTERVAL_INACTIVE") || 5000;

export const useGetCurrentHand = (gameId: number, refetchingHand: boolean) => {
  const { data: playerCommonCards } = useGetCommonCards(gameId);
  const { data: playerEffectCards } = useGetEffectCards(gameId);

  const queryResponse = useQuery<CurrentHandResponse>(
    [CURRENT_HAND_QUERY_KEY, gameId],
    () => fetchGraphQLData(gameId),
    {
      enabled: playerCommonCards.length > 0 && playerEffectCards.length > 0,
      refetchInterval: refetchingHand
        ? REFETCH_HAND_INTERVAL_ACTIVE
        : REFETCH_HAND_INTERVAL_INACTIVE, // if refetching hand is active, refetch hand more often
      cacheTime: 0, // Disable caching
      staleTime: 0, // Make data stale immediately
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    }
  );
  const { data } = queryResponse;
  console.log("data", data);
  console.log(
    "after duplicates",
    filterDuplicates(data?.currentHandCardModels?.edges ?? [])
  );

  const cards: Card[] = filterDuplicates(
    data?.currentHandCardModels?.edges ?? []
  ).map((edge) => {
    const dojoCard = edge.node;
    const commonCard = playerCommonCards.find(
      (card) => card.idx === dojoCard.player_card_id
    )!;
    const effectCard = playerEffectCards.find(
      (card) => card.idx === dojoCard.player_card_id
    )!;
    console.log("dojo card", dojoCard);
    console.log("common card", commonCard);
    console.log("effect card", effectCard);
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
