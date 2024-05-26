import { useQuery } from "react-query";
import graphQLClient from "../graphQLClient";
import { StaticEffectCard } from "../types/Card";
import { Effect } from "../types/Effect";
import { GET_STATIC_EFFECT_CARDS } from "./gqlQueries";

export const STATIC_EFFECT_CARD_QUERY_KEY = "static-effect-cards";

interface EffectCardEdge {
  node: {
    id: number;
    effect_id: number;
    type_effect_card: string;
    price: number;
    probability: number;
  };
}

interface EffectCardsResponse {
  effectCardModels: {
    edges: EffectCardEdge[];
  };
}

const fetchGraphQLData = async (): Promise<EffectCardsResponse> => {
  return await graphQLClient.request(GET_STATIC_EFFECT_CARDS);
};

export const useGetStaticEffectCards = (effects: Effect[]) => {
  const queryResponse = useQuery<EffectCardsResponse>(
    [STATIC_EFFECT_CARD_QUERY_KEY],
    () => fetchGraphQLData(),
    { enabled: effects.length > 0 }
  );
  // console.log("effects", effects);
  const { data } = queryResponse;

  const dojoEffectCards = data?.effectCardModels?.edges;
  // console.log("dojoEffectCards", dojoEffectCards);

  const cards: StaticEffectCard[] =
    dojoEffectCards?.map((edge) => {
      const card = edge.node;
      const effect = effects.find((effect) => effect.id === card.effect_id);
      return { ...effect, ...edge.node };
    }) ?? [];

  // console.log("ssss effect cards", cards);
  return {
    ...queryResponse,
    data: cards,
  };
};
