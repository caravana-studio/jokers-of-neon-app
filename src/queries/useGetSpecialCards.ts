import { useQuery } from "react-query";
import graphQLClient from "../graphQLClient";
import { GET_SPECIALS_CARDS_QUERY } from "./gqlQueries";

export const SPECIALS_CARDS_QUERY = "special-cards";

interface RoundEdge {
  node: {
    idx: number;
    effect_card_id: number;
    is_temporary: boolean;
    remaining: number;
  };
}

interface SpecialCardsQueryResponse {
  currentSpecialCardsModels: {
    edges: RoundEdge[];
  };
}

const fetchGraphQLData = async (
  gameId: number
): Promise<SpecialCardsQueryResponse> => {
  return await graphQLClient.request(GET_SPECIALS_CARDS_QUERY, { gameId });
};

export const useGetSpecialCards = (gameId: number) => {
  const queryResponse = useQuery<SpecialCardsQueryResponse>(
    [SPECIALS_CARDS_QUERY, gameId],
    () => fetchGraphQLData(gameId),
    {}
  );
  const { data } = queryResponse;

  const apiSpecials = data?.currentSpecialCardsModels?.edges.map((edge) => {
    return {
      card_id: edge.node.effect_card_id,
      isSpecial: true,
      id: edge.node.effect_card_id.toString(),
      idx: edge.node.idx,
      img: `effect/${edge.node.effect_card_id}.png`,
      temporary: edge.node.is_temporary,
      remaining: edge.node.remaining,
    };
  }) || [];

  return {
    ...queryResponse,
    data: apiSpecials,
  };
};
