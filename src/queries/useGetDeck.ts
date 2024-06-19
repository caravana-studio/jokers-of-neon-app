import { useQuery } from "react-query";
import graphQLClient from "../graphQLClient";
import { GET_DECK_QUERY } from "./gqlQueries";
import { Deck } from '../types/Deck.ts';
import { Card } from '../types/Card.ts'
import { MODIFIER_CARDS_DATA } from '../data/modifiers.ts'

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
  deckCardModels: {
    edges: {
      node: {
        idx: number;
        player_card_id: number;
        type_player_card: string;
        card_id: number;
      }
    }[]
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

const createCard = (card_id: number, idx: number, isEffectCard: boolean) => {
  return {
    card_id: card_id,
    id: idx.toString(),
    idx: idx,
    img: `${isEffectCard ? "effect/" : ""}${card_id}.png`,
    isModifier: isEffectCard,
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
      .map(({node: dojoCard}) =>
        createCard(dojoCard.common_card_id, dojoCard.idx, false)
      ) ?? [];

  const effectCards: Card[] = data?.playerEffectCardsModels?.edges
      .map(({node: dojoCard}) =>
        createCard(dojoCard.effect_card_id, dojoCard.idx, true)
      ) ?? [];


  const currentCommonCards = [];
  const currentEffectCards = [];
  const edges = data?.deckCardModels?.edges ?? [];
  for (let i = 0; i < deckLength; i++) {
    const dojoCard = edges[i].node;
    if (dojoCard.type_player_card === 'Common') {
      currentCommonCards.push(createCard(dojoCard.card_id, dojoCard.idx, false));
    } else {
      currentEffectCards.push(createCard(dojoCard.card_id, dojoCard.idx, false));
    }
  }

  console.log("currentEffectCards: ", currentEffectCards.length);
  console.log("currentCommonCards: ", currentCommonCards.length);

  const deck: Deck = {
    currentLength: deckLength,
    size: deckSize,
    commonCards: commonCards,
    effectCards: effectCards,
    currentEffectCards: currentEffectCards,
    currentCommonCards: currentCommonCards,
  }
  return {
    ...queryResponse,
    data: deck,
  };
};
