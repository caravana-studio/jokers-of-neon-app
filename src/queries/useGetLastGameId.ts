import { gql } from "graphql-tag";
import { useQuery } from "react-query";
import graphQLClient from "../graphQLClient";
import { snakeToCamel } from "../utils/snakeToCamel";

export const LAST_GAME_ID_QUERY_KEY = "lastGameId";

const DOJO_NAMESPACE =
  import.meta.env.VITE_DOJO_NAMESPACE || "jokers_of_neon_core";
const CAMEL_CASE_NAMESPACE = snakeToCamel(DOJO_NAMESPACE);
const QUERY_FIELD_NAME = `${CAMEL_CASE_NAMESPACE}GameModels`;

export const GET_LAST_GAME_ID_QUERY = gql`
  query GetLastGame {
    ${QUERY_FIELD_NAME}(
      order: { field: "ID", direction: "DESC" }
      first: 1
    ) {
      edges {
        node {
          id
        }
      }
    }
  }
`;

interface GameNode {
  id: string;
}

interface LastGameResponse {
  [key: string]: {
    edges: Array<{ node: GameNode }>;
  };
}

const fetchLastGameId = async (): Promise<LastGameResponse> => {
  return await graphQLClient.request(GET_LAST_GAME_ID_QUERY);
};

export const useGetLastGameId = () => {
  const { data, isLoading, error, refetch } = useQuery<LastGameResponse>(
    [LAST_GAME_ID_QUERY_KEY],
    fetchLastGameId
  );

  const lastGameId = data?.[QUERY_FIELD_NAME]?.edges?.[0]?.node?.id;

  return {
    lastGameId: lastGameId ? parseInt(lastGameId, 16) : 0,
    isLoading,
    error,
    refetch,
  };
};
