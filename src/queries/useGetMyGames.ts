import { gql } from "graphql-tag";
import { useQuery } from "react-query";
import { useDojo } from "../dojo/DojoContext";
import { GameStateEnum } from "../dojo/typescript/custom";
import graphQLClient from "../graphQLClient";
import { GameSummary } from "../pages/MyGames/MyGames";
import { snakeToCamel } from "../utils/snakeToCamel";
import { normalizeStarknetAddress } from "../utils/starknetAddress";

const translateGameState = (state: string) => {
  return state.replace(/_/g, " ");
};

export const MY_GAMES_QUERY_KEY = "myGamesWithData";
const DOJO_NAMESPACE =
  import.meta.env.VITE_DOJO_NAMESPACE || "jokers_of_neon_core";
const CAMEL_CASE_NAMESPACE = snakeToCamel(DOJO_NAMESPACE);
const GAME_FIELD_NAME = `${CAMEL_CASE_NAMESPACE}GameModels`;

// Query only for game data
const GAMES_QUERY = gql`
  query ($owner: ContractAddress) {
    games: ${GAME_FIELD_NAME}(
      where: { ownerEQ: $owner }
      first: 10000
      order: { field: "LEVEL", direction: "DESC" }
    ) {
      edges {
        node {
          player_score
          level
          player_name
          id
          mod_id
          state
          current_node_id
          round
          is_tournament
        }
      }
    }
  }
`;

interface GameDataNode {
  player_score: number;
  level: number;
  id: string;
  mod_id: string;
  state?: string;
  current_node_id?: number;
  round?: number;
  is_tournament?: boolean;
}

interface GamesQueryResponse {
  games: {
    edges: Array<{ node: GameDataNode }>;
  };
}

const fetchGames = async (
  owner: string
): Promise<GamesQueryResponse> => {
  return await graphQLClient.request(GAMES_QUERY, {
    owner: normalizeStarknetAddress(owner),
  });
};

export const useGetMyGames = () => {
  const {
    account: { account },
  } = useDojo();
  const owner = account?.address ?? "";

  const { data, isLoading, error, refetch } = useQuery<GamesQueryResponse>(
    [MY_GAMES_QUERY_KEY, owner],
    () => fetchGames(owner),
    {
      enabled: !!owner,
    }
  );

  const gameSummaries: GameSummary[] =
    data?.games?.edges.map(({ node }) => ({
      id: Number(node.id),
      level: node.level,
      status: node.state
        ? translateGameState(node.state)
        : GameStateEnum.NotStarted,
      points: node.player_score,
      currentNodeId: node.current_node_id,
      round: node.round,
      isTournament: node.is_tournament,
    })) || [];

  const sortedGames = gameSummaries
    .filter((game) => game.status !== GameStateEnum.NotStarted)
    .sort((a, b) => b.id - a.id);

  return {
    data: sortedGames,
    isLoading,
    error,
    refetch,
  };
};
