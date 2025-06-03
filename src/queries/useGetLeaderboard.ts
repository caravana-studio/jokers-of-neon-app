import { gql } from "graphql-tag";
import { useQuery } from "react-query";
import { decodeString, encodeString } from "../dojo/utils/decodeString";
import graphQLClient from "../graphQLClient";
import { useGameContext } from "../providers/GameProvider";
import { signedHexToNumber } from "../utils/signedHexToNumber";
import { snakeToCamel } from "../utils/snakeToCamel";
import { hardcodedLeadersGG } from "./hardcodedLeadersgg";

export const LEADERBOARD_QUERY_KEY = "leaderboard";

const DOJO_NAMESPACE =
  import.meta.env.VITE_DOJO_NAMESPACE || "jokers_of_neon_core";
const CAMEL_CASE_NAMESPACE = snakeToCamel(DOJO_NAMESPACE);
const QUERY_FIELD_NAME = `${CAMEL_CASE_NAMESPACE}GameModels`;

export const LEADERBOARD_QUERY = gql`
  query ($modId: String!) {
    ${QUERY_FIELD_NAME}(
      where: { mod_idEQ: $modId }
      first: 10000
      order: { field: "LEVEL", direction: "DESC" }
    ) {
      edges {
        node {
          player_score
          level
          player_name
          id
        }
      }
    }
  }
`;

export interface GameEdge {
  node: {
    player_score: number;
    level: number;
    player_name: string;
    id: number;
  };
}

type LeaderboardResponse = Record<string, { edges: GameEdge[] }>;

const getPrize = (position: number): number => {
  if (position >= 3 && position <= 6) {
    return 100;
  } else if (position >= 7 && position <= 10) {
    return 50;
  }
  switch (position) {
    case 1:
      return 300;
    case 2:
      return 200;
    default:
      return 0;
  }
};

export const CURRENT_LEADER_NAME_KEY = "current_leader_name";

const fetchGraphQLData = async (
  modId: string
): Promise<LeaderboardResponse> => {
  console.log("modId", modId);
  console.log("modId eb", encodeString(modId));
  return await graphQLClient.request(LEADERBOARD_QUERY, {
    modId: encodeString(modId),
  });
};

export const useGetLeaderboard = (gameId?: number) => {
  const { modId } = useGameContext();
  const queryResponse = useQuery<LeaderboardResponse>(
    [LEADERBOARD_QUERY_KEY, modId, gameId],
    () => fetchGraphQLData(modId)
  );

  const { data } = queryResponse;

  const leaderboardMap = new Map<
    string,
    { id: number; player_name: string; player_score: number; level: number }
  >();
  let currentGameEntry: {
    id: number;
    player_name: string;
    player_score: number;
    level: number;
  } | null = null;

  const fullData = {
    jokersOfNeonCoreGameModels: {
      edges: [
        ...(data?.jokersOfNeonCoreGameModels?.edges ?? []),
        ...hardcodedLeadersGG,
      ],
    },
  };

  fullData.jokersOfNeonCoreGameModels.edges
    ?.filter((edge) => edge.node.player_score > 0)
    .forEach((edge) => {
      const decodedName = decodeString(edge.node.player_name ?? "");
      const playerId = signedHexToNumber(edge.node.id.toString());

      const entry = {
        id: edge.node.id,
        player_name: decodedName,
        player_score: edge.node.player_score,
        level: edge.node.level,
      };

      if (playerId === gameId) {
        currentGameEntry = entry;
      }

      if (!leaderboardMap.has(decodedName)) {
        leaderboardMap.set(decodedName, entry);
      } else {
        const existing = leaderboardMap.get(decodedName)!;
        if (
          entry.level > existing.level ||
          (entry.level === existing.level &&
            entry.player_score > existing.player_score)
        ) {
          leaderboardMap.set(decodedName, entry);
        }
      }
    });

  const leaderboardArray = Array.from(leaderboardMap.values());

  if (
    currentGameEntry &&
    !leaderboardArray.some((entry) => entry.id === currentGameEntry!.id)
  ) {
    leaderboardArray.push(currentGameEntry);
  }

  const sortedLeaderboard = leaderboardArray.sort((a, b) => {
    if (a.level !== b.level) {
      return b.level - a.level;
    }
    return b.player_score - a.player_score;
  });

  const leaderboard = sortedLeaderboard.map((leader, index) => ({
    ...leader,
    position: index + 1,
    prize: getPrize(index + 1),
  }));

  return {
    ...queryResponse,
    data: leaderboard,
  };
};
