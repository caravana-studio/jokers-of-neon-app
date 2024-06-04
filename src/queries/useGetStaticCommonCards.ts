import gql from "graphql-tag";
import { useQuery } from "react-query";
import { Cards } from "../enums/cards";
import { Suits } from "../enums/suits";
import graphQLClient from "../graphQLClient";
import { Card, StaticCommonCard } from "../types/Card";
import { zeroPad } from "../utils/zeroPad";

export const STATIC_COMMON_CARD_QUERY_KEY = "static-common-cards";

const GET_STATIC_COMMON_CARDS = gql`
query {
  cardModels(first: 1000) {
    edges {
      node {
        id,
        suit,
        value,
        points
      }
    }
  }
}
`;

interface StaticCommonCardEdge {
  node: {
    id: number;
    suit: string;
    value: string;
    points: number;
  };
}

interface StaticCommonCardsResponse {
  cardModels: {
    edges: StaticCommonCardEdge[];
  };
}

const fetchGraphQLData = async (
): Promise<StaticCommonCardsResponse> => {
  return await graphQLClient.request(GET_STATIC_COMMON_CARDS);
};

export const useGetStaticCommonCards = () => {
  const queryResponse = useQuery<StaticCommonCardsResponse>(
    [STATIC_COMMON_CARD_QUERY_KEY],
    () => fetchGraphQLData()
  );
  const { data } = queryResponse;

  const dojoCommonCards = data?.cardModels?.edges;

  const cards: StaticCommonCard[] =
    dojoCommonCards?.map((edge) => {
      const dojoCard = edge.node;
      const value = Cards[dojoCard!.value.toUpperCase() as keyof typeof Cards];
      const suit = Suits[dojoCard!.suit.toUpperCase() as keyof typeof Suits];
      const img = `${dojoCard!.suit.charAt(0)}${zeroPad(value, 2)}.png`;
      return {
        id: dojoCard.id,
        value,
        suit,
        img,
        points: dojoCard.points
      };
    }) ?? [];
  return {
    ...queryResponse,
    data: cards,
  };
};
