import { gql } from "graphql-tag";
import { useQuery } from "react-query";
import { decodeString, encodeString } from "../dojo/utils/decodeString";
import graphQLClient from "../graphQLClient";
import { useGameContext } from "../providers/GameProvider";
import { snakeToCamel } from "../utils/snakeToCamel";
import { signedHexToNumber } from "../utils/signedHexToNumber";
import { getNode } from "../dojo/queries/getNode";
import { useDojo } from "../dojo/useDojo";

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
          current_node_id
        }
      }
    }
  }
`;

interface GameEdge {
  node: {
    player_score: number;
    level: number;
    player_name: string;
    id: number;
    current_node_id: number;
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
  modId: string,
  client: any,
  gameId?: number
): Promise<{
  leaderboard: {
    id: number;
    player_name: string;
    player_score: number;
    level: number;
    round: number;
    position: number;
    prize: number;
  }[];
}> => {
  const rawData: any = await graphQLClient.request(LEADERBOARD_QUERY, {
    modId: encodeString(modId),
  });

  const leaderboardMap = new Map<
    string,
    {
      id: number;
      player_name: string;
      player_score: number;
      level: number;
      round: number;
    }
  >();

  let currentGameEntry: {
    id: number;
    player_name: string;
    player_score: number;
    level: number;
    round: number;
  } | null = null;

  const edges = rawData?.[QUERY_FIELD_NAME]?.edges ?? [];

  const processed = await Promise.all(
    edges
      .filter((edge: any) => edge.node.player_score > 0)
      .map(async (edge: any) => {
        const decodedName = decodeString(edge.node.player_name ?? "");
        const playerId = signedHexToNumber(edge.node.id.toString());

        const round = await getNode(
          client,
          edge.node.id ?? 0,
          edge.node.current_node_id ?? 0
        );

        const entry = {
          id: edge.node.id,
          player_name: decodedName,
          player_score: edge.node.player_score,
          level: edge.node.level,
          round,
        };

        return { decodedName, playerId, entry };
      })
  );

  for (const { decodedName, playerId, entry } of processed) {
    if (playerId === gameId) {
      currentGameEntry = entry;
    }

    const existing = leaderboardMap.get(decodedName);
    if (
      !existing ||
      entry.level > existing.level ||
      (entry.level === existing.level &&
        entry.player_score > existing.player_score)
    ) {
      leaderboardMap.set(decodedName, entry);
    }
  }

  const leaderboardArray = Array.from(leaderboardMap.values());

  if (
    currentGameEntry &&
    !leaderboardArray.some((entry) => entry.id === currentGameEntry?.id)
  ) {
    leaderboardArray.push(currentGameEntry);
  }

  const sortedLeaderboard = leaderboardArray.sort((a, b) => {
    if (a.level !== b.level) return b.level - a.level;
    return b.player_score - a.player_score;
  });

  const leaderboard = sortedLeaderboard.map((leader, index) => ({
    ...leader,
    position: index + 1,
    prize: getPrize(index + 1),
  }));

  return { leaderboard };
};

export const useGetLeaderboard = (gameId?: number) => {
  const { modId } = useGameContext();
  const {
    setup: { client },
  } = useDojo();

  const queryResponse = useQuery([LEADERBOARD_QUERY_KEY, modId, gameId], () =>
    fetchGraphQLData(modId, client, gameId)
  );

  return {
    ...queryResponse,
    data: queryResponse.data?.leaderboard ?? [],
  };
};
