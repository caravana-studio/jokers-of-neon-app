import { useQuery } from "react-query";
import { Suits } from "../enums/suits";
import graphQLClient from "../graphQLClient";
import { useStaticCards } from "../providers/StaticCardsProvider";
import { Card, StaticEffectCard } from "../types/Card";
import { GET_PLAYER_EFFECT_CARDS } from "./gqlQueries";

export const EFFECT_CARD_QUERY_KEY = "effect-cards";

interface EffectCardEdge {
  node: {
    idx: number;
    game_id: number;
    effect_card_id: number;
  };
}

interface EffectCardsResponse {
  playerEffectCardsModels: {
    edges: EffectCardEdge[];
  };
}

const fetchGraphQLData = async (
  gameId: number
): Promise<EffectCardsResponse> => {
  return await graphQLClient.request(GET_PLAYER_EFFECT_CARDS, { gameId });
};

const getCardName = (effectCard: StaticEffectCard) => {
  if (effectCard.suit) {
    return Suits[effectCard.suit]
  } else if (effectCard.multi_add) {
    return `multi+${effectCard.multi_add}`
  } else if (effectCard.multi_multi) {
    return `multix${effectCard.multi_multi}`
  } else if (effectCard.points) {
    return `points+${effectCard.points}`
  }
}

export const useGetEffectCards = (gameId: number) => {
  const { effectCards: staticEffectCards } = useStaticCards();

  const queryResponse = useQuery<EffectCardsResponse>(
    [EFFECT_CARD_QUERY_KEY, gameId],
    () => fetchGraphQLData(gameId)
  );
  const { data } = queryResponse;

  const dojoEffectCards = data?.playerEffectCardsModels?.edges;
  // console.log("dojoEffectCards", dojoEffectCards);

  const cards: Card[] =
    dojoEffectCards?.map((edge) => {
      const dojoCard = edge.node;
      const staticEffectCard = staticEffectCards.find(
        (card) => card.id === dojoCard.effect_card_id
      );
      const isModifier = staticEffectCard?.type_effect_card === "Modifier";
      const img = `${staticEffectCard?.type_effect_card ?? "Special"}/${staticEffectCard && getCardName(staticEffectCard)}.png`;
      return {
        id: dojoCard!.idx.toString(),
        idx: dojoCard!.idx,
        img,
        isModifier,
      };
    }) ?? [];
  return {
    ...queryResponse,
    data: cards,
  };
};
