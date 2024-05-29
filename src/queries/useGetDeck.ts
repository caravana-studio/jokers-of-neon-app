import { useQuery } from "react-query";
import graphQLClient from "../graphQLClient";
import { GET_DECK_QUERY } from "./gqlQueries"
import { Deck } from '../types/Deck.ts'

export const DECK_QUERY_KEY = "deck";

interface RoundEdge {
  node: {
    current_len_deck: number
  };
}

interface DeckQueryResponse {
  roundModels: {
    edges: RoundEdge[];
  };
  playerCommonCardsModels: {
    totalCount: number;
  };
  playerEffectCardsModels: {
    totalCount: number;
  };
}

const fetchGraphQLData = async (
  gameId: number
): Promise<DeckQueryResponse> => {
  return await graphQLClient.request(GET_DECK_QUERY, { gameId });
};


export const useGetDeck = (gameId: number) => {
  const queryResponse = useQuery<DeckQueryResponse>(
    [DECK_QUERY_KEY, gameId],
    () => fetchGraphQLData(gameId),
    {}
  );
  const { data } = queryResponse;

  const deckLength = data?.roundModels?.edges[0]?.node?.current_len_deck ?? 0;

  const deckSize = (data?.playerCommonCardsModels?.totalCount ?? 0)
                            + (data?.playerEffectCardsModels?.totalCount ?? 0);

  const deck: Deck = {
    currentLength: deckLength,
    size: deckSize
  }
  return {
    ...queryResponse,
    data: deck,
  };
};
