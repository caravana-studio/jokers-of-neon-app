import { gql } from "graphql-tag";
import { useQuery } from "react-query";
import graphQLClient from "../graphQLClient";
import { Deck } from "../types/Deck.ts";

export const DECK_QUERY_KEY = "deck";

const GET_DECK_QUERY = gql`
  query GetDeck($gameId: ID!) {
    jokersOfNeonRoundModels(where: { game_idEQ: $gameId }) {
      edges {
        node {
          current_len_deck
        }
      }
    }
    jokersOfNeonPlayerCommonCardsModels(where: { game_idEQ: $gameId }) {
      totalCount
    }
    jokersOfNeonPlayerEffectCardsModels(where: { game_idEQ: $gameId }) {
      totalCount
    }
  }
`;

interface RoundEdge {
  node: {
    current_len_deck: number;
  };
}

interface DeckQueryResponse {
  jokersOfNeonRoundModels: {
    edges: RoundEdge[];
  };
  jokersOfNeonPlayerCommonCardsModels: {
    totalCount: number;
  };
  jokersOfNeonPlayerEffectCardsModels: {
    totalCount: number;
  };
}

const fetchGraphQLData = async (gameId: number): Promise<DeckQueryResponse> => {
  return await graphQLClient.request(GET_DECK_QUERY, { gameId });
};

export const useGetDeck = (gameId: number) => {
  const queryResponse = useQuery<DeckQueryResponse>(
    [DECK_QUERY_KEY, gameId],
    () => fetchGraphQLData(gameId),
    {}
  );
  const { data } = queryResponse;

  const deckLength =
    data?.jokersOfNeonRoundModels?.edges[0]?.node?.current_len_deck ?? 0;

  const deckSize =
    (data?.jokersOfNeonPlayerCommonCardsModels?.totalCount ?? 0) +
    (data?.jokersOfNeonPlayerEffectCardsModels?.totalCount ?? 0);

  const deck: Deck = {
    currentLength: deckLength,
    size: deckSize,
  };
  return {
    ...queryResponse,
    data: deck,
  };
};
