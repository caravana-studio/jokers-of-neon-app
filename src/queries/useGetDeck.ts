import { useQuery } from "react-query";
import graphQLClient from "../graphQLClient";
import { GET_DECK_QUERY } from "./gqlQueries";
import { Deck } from '../types/Deck.ts';
import { Card } from '../types/Card.ts'

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
    edges: {
      node: {
        idx: number;
        common_card_id: number;
      }
    }[]
  }
  playerEffectCardsModels: {
    totalCount: number;
    edges: {
      node: {
        idx: number;
        effect_card_id: number;
      }
    }[]
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

  const commonCards = data?.playerCommonCardsModels?.edges
    .map(({node: dojoCard}) => {
      const card_id = dojoCard.common_card_id;
      return {
        card_id: card_id,
        id: dojoCard.idx.toString(),
        idx: dojoCard.idx,
        img: `${card_id}.png`
      };
    })
    ?? [];

  const effectCards: Card[] = data?.playerEffectCardsModels?.edges
      .map(({node: dojoCard}) => {
        const card_id = dojoCard.effect_card_id;
        return {
          card_id: card_id,
          isModifier: true,
          id: dojoCard.idx.toString(),
          idx: dojoCard.idx,
          img: `effect/${card_id}.png`
        };
      })
    ?? [];

  const deck: Deck = {
    currentLength: deckLength,
    size: deckSize,
    commonCards: commonCards,
    effectCards: effectCards

  }
  return {
    ...queryResponse,
    data: deck,
  };
};
