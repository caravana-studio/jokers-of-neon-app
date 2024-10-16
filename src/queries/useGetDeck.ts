import { useQuery } from "react-query";
import graphQLClient from "../graphQLClient";
import { gql } from "graphql-tag";
import { getCardFromCardId } from "../dojo/utils/getCardFromCardId";
import { getCardData } from "../utils/getCardData";
import { Deck } from "../types/Deck";

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
    jokersOfNeonDeckCardModels(where: { game_idEQ: $gameId }, limit: 10000) {
      edges {
        node {
          game_id
          idx
          card_id
        }
      }
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
  jokersOfNeonDeckCardModels: {
    edges: {
      node: {
        game_id: number;
        idx: number;
        card_id: number;
      };
    }[];
  };
}

const fetchGraphQLData = async (gameId: number): Promise<DeckQueryResponse> => {
  return await graphQLClient.request(GET_DECK_QUERY, { gameId });
};

export const useGetDeck = (gameId: number): Deck => {
  const queryResponse = useQuery<DeckQueryResponse>(
    [DECK_QUERY_KEY, gameId],
    () => fetchGraphQLData(gameId),
    {}
  );

  const { data } = queryResponse;
  const deckSize =
    data?.jokersOfNeonRoundModels?.edges[0].node.current_len_deck ?? 0;

  const deckCards =
    data?.jokersOfNeonDeckCardModels?.edges
      .filter(({ node: dojoCard }) => dojoCard.idx < deckSize)
      .map(({ node: dojoCard }) => {
        const card = getCardFromCardId(dojoCard?.card_id, dojoCard.idx);
        const cardData = { ...getCardData(card) };

        return {
          ...card,
          ...cardData,
          isNeon:
            dojoCard?.card_id === 53 ||
            (dojoCard?.card_id >= 200 && dojoCard?.card_id <= 251),
        };
      }) ?? [];

  return {
    size: deckSize,
    currentLength: deckSize,
    cards: deckCards,
  };
};
