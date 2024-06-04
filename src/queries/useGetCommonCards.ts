import gql from "graphql-tag";
import { useQuery } from "react-query";
import graphQLClient from "../graphQLClient";
import { useStaticCards } from "../providers/StaticCardsProvider";
import { Card } from "../types/Card";

export const COMMON_CARD_QUERY_KEY = "common-cards";

const GET_COMMON_CARDS = gql`
  query GetCommonCards($gameId: ID!) {
    playerCommonCardsModels(first: 1000, where: { game_idEQ: $gameId }) {
      edges {
        node {
          idx
          game_id
          common_card_id
        }
      }
    }
  }
`;

interface CommonCardEdge {
  node: {
    idx: number;
    gameId: number;
    common_card_id: number;
  };
}

interface CommonCardsResponse {
  playerCommonCardsModels: {
    edges: CommonCardEdge[];
  };
}

const fetchGraphQLData = async (
  gameId: number
): Promise<CommonCardsResponse> => {
  return await graphQLClient.request(GET_COMMON_CARDS, { gameId });
};

export const useGetCommonCards = (gameId: number) => {
  const { commonCards: staticCommonCards } = useStaticCards();

  const queryResponse = useQuery<CommonCardsResponse>(
    [COMMON_CARD_QUERY_KEY, gameId],
    () => fetchGraphQLData(gameId),
    {enabled: staticCommonCards.length > 0}
  );
  const { data } = queryResponse;

  const dojoCommonCards = data?.playerCommonCardsModels?.edges;

  const cards: Card[] =
    dojoCommonCards?.map((edge) => {
      const dojoCard = edge.node;
      const staticCommonCard = staticCommonCards.find(
        (card) => card.id === dojoCard.common_card_id
      );
      const { value, suit, img} = staticCommonCard!
      return {
        id: dojoCard!.idx.toString(),
        value,
        idx: dojoCard!.idx,
        suit,
        img,
      };
    }) ?? [];
  return {
    ...queryResponse,
    data: cards,
  };
};
