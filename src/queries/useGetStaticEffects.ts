import { useQuery } from "react-query";
import { Suits } from "../enums/suits";
import graphQLClient from "../graphQLClient";
import { Effect } from "../types/Effect";
import { GET_STATIC_EFFECTS } from "./gqlQueries";

export const STATIC_EFFECT_QUERY_KEY = "static-effect";

interface EffectEdge {
  node: {
    id: number;
    points: number;
    multi_add: number;
    multi_multi: number;
    suit: string;
  };
}

interface EffectsResponse {
  effectModels: {
    edges: EffectEdge[];
  };
}

const fetchGraphQLData = async (): Promise<EffectsResponse> => {
  return await graphQLClient.request(GET_STATIC_EFFECTS);
};

export const useGetStaticEffects = () => {
  const queryResponse = useQuery<EffectsResponse>(
    [STATIC_EFFECT_QUERY_KEY],
    () => fetchGraphQLData()
  );
  const { data } = queryResponse;

  const dojoEffectCards = data?.effectModels?.edges;
  // console.log("dojoEffectCards", dojoEffectCards);

  const effects: Effect[] =
    dojoEffectCards?.map((edge) => {
      const effect = edge.node;
      const suit = effect.suit
        ? Suits[effect.suit.toUpperCase() as keyof typeof Suits]
        : undefined;
      return { ...edge.node, suit };
    }) ?? [];
  return {
    ...queryResponse,
    data: effects,
  };
};
