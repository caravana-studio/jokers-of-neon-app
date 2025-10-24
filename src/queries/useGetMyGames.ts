import { gql } from "graphql-tag";
import { useQuery } from "react-query";
import { GameStateEnum } from "../dojo/typescript/custom";
import { decodeString, encodeString } from "../dojo/utils/decodeString";
import { useUsername } from "../dojo/utils/useUsername";
import graphQLClient from "../graphQLClient";
import { GameSummary } from "../pages/MyGames/MyGames";
import { snakeToCamel } from "../utils/snakeToCamel";

const translateGameState = (state: string) => {
  return state.replace(/_/g, " ");
};

export const MY_GAMES_QUERY_KEY = "myGamesWithData";
const DOJO_NAMESPACE =
  import.meta.env.VITE_DOJO_NAMESPACE || "jokers_of_neon_core";
const CAMEL_CASE_NAMESPACE = snakeToCamel(DOJO_NAMESPACE);
const TOKEN_FIELD_NAME = `${CAMEL_CASE_NAMESPACE}TokenMetadataModels`;
const GAME_FIELD_NAME = `${CAMEL_CASE_NAMESPACE}GameModels`;

// Combined query for both token metadata and game data
const COMBINED_QUERY = gql`
 query ($playerName: String) {
   tokens: ${TOKEN_FIELD_NAME}(
     where: { player_nameEQ: $playerName }
     first: 10000
   ) {
     edges {
       node {
         token_id
         minted_by
         player_name
         settings_id
         lifecycle {
           mint
         }
       }
     }
   }
   games: ${GAME_FIELD_NAME}(
     where: { player_nameEQ: $playerName }
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
       }
     }
   }
 }
`;

interface TokenMetadataNode {
  token_id: string;
  minted_by: string;
  player_name: string;
  settings_id: string;
  lifecycle: {
    mint: string;
  };
}

interface GameDataNode {
  player_score: number;
  level: number;
  player_name: string;
  id: string;
  mod_id: string;
  state?: string;
  current_node_id?: number;
  round?: number;
}

interface CombinedQueryResponse {
  tokens: {
    edges: Array<{ node: TokenMetadataNode }>;
  };
  games: {
    edges: Array<{ node: GameDataNode }>;
  };
}

const fetchCombinedData = async (
  playerName: string
): Promise<CombinedQueryResponse> => {
  return await graphQLClient.request(COMBINED_QUERY, {
    playerName: encodeString(playerName),
  });
};

export const useGetMyGames = () => {
  const username = useUsername();

  // Single query to get both token metadata and game data
  const { data, isLoading, error, refetch } = useQuery<CombinedQueryResponse>(
    [MY_GAMES_QUERY_KEY, username],
    () => fetchCombinedData(username ?? ""),
    {
      enabled: !!username,
    }
  );

  // Process the combined data
  const tokenMetadata =
    data?.tokens?.edges.map((edge) => ({
      ...edge.node,
      id: parseInt(edge.node.token_id),
      player_name: decodeString(edge.node.player_name ?? ""),
      minted_by: decodeString(edge.node.minted_by ?? ""),
    })) || [];

  const gameData =
    data?.games?.edges.map((edge) => ({
      ...edge.node,
      player_name: decodeString(edge.node.player_name ?? ""),
    })) || [];

  // Create a map of game data for faster lookups
  const gameDataMap = new Map<number, GameDataNode>();
  gameData.forEach((game) => {
    gameDataMap.set(Number(game.id), game);
  });

  // Format data according to GameSummary interface
  const gameSummaries: GameSummary[] = tokenMetadata.map((token) => {
    // Find matching game data using the map for efficiency
    const matchingGame = gameDataMap.get(token.id);

    if (matchingGame) {
      return {
        id: token.id,
        level: matchingGame.level,
        // Use the game's status if available, otherwise "NOT STARTED"
        status: matchingGame.state
          ? translateGameState(matchingGame.state)
          : GameStateEnum.NotStarted,
        points: matchingGame.player_score,
        currentNodeId: matchingGame.current_node_id,
        round: matchingGame.round,
      };
    }

    // Return token with default "NOT STARTED" status if no matching game data
    return {
      id: token.id,
      status: GameStateEnum.NotStarted,
    };
  });

  return {
    data: gameSummaries.filter(game => game.status !== GameStateEnum.NotStarted),
    isLoading,
    error,
    refetch,
  };
};
