import { useQuery } from "react-query";
import { SortBy } from "../enums/sortBy";
import graphQLClient from "../graphQLClient";
import { Card } from "../types/Card";
import { sortCards } from "../utils/sortCards";
import { GET_CURRENT_HAND_QUERY } from "./gqlQueries";

export const CURRENT_HAND_QUERY_KEY = "current-hand";

interface CardEdge {
  node: {
    game_id: number;
    idx: number;
    type_player_card: string;
    player_card_id: number;
    card_id: number;
  };
}

interface CurrentHandResponse {
  jokersOfNeonCurrentHandCardModels: {
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

export const useGetCurrentHand = (gameId: number, sortBy: SortBy) => {
  const queryResponse = useQuery<CurrentHandResponse>(
    [CURRENT_HAND_QUERY_KEY, gameId],
    () => fetchGraphQLData(gameId)
  );
  const { data } = queryResponse;

  const cards: Card[] = filterDuplicates(
    data?.jokersOfNeonCurrentHandCardModels?.edges ?? []
  )
    // filter out null cards (represented by card_id 9999)
    .filter((edge) => edge.node.card_id !== 9999)
    .map((edge) => {
      const dojoCard = edge.node;
      return {
        ...dojoCard,
        img: `${dojoCard.type_player_card === "Effect" ? "effect/" : ""}${dojoCard.card_id}.png`,
        isModifier: dojoCard.type_player_card === "Effect",
        idx: dojoCard.idx,
        id: dojoCard.idx.toString(),
      };
    });

  const sortedCards = sortCards(cards, sortBy);
  return {
    ...queryResponse,
    data: sortedCards,
  };
};
