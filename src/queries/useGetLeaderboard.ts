import { gql } from "graphql-tag";
import { useQuery } from "react-query";
import { useDojo } from "../dojo/useDojo";
import { decodeString, encodeString } from "../dojo/utils/decodeString";
import graphQLClient from "../graphQLClient";
import { useGameStore } from "../state/useGameStore";
import { signedHexToNumber } from "../utils/signedHexToNumber";
import { snakeToCamel } from "../utils/snakeToCamel";

export const LEADERBOARD_QUERY_KEY = "leaderboard";
const guestNamePattern = /^joker_guest_\d+$/;

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
          round
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
    round: number;
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

const fetchGraphQLData = async (
  modId: string,
  client: any,
  filterLoggedInPlayers: boolean,
  gameId?: number
) => {
  const rawData: LeaderboardResponse = await graphQLClient.request(
    LEADERBOARD_QUERY,
    {
      modId: encodeString(modId),
    }
  );

  const edges = rawData?.[QUERY_FIELD_NAME]?.edges ?? [];

  const processedEntries = await Promise.all(
    edges
      .filter((edge) => edge.node.player_score > 0)
      .map(async (edge) => {
        return {
          id: edge.node.id,
          player_name: decodeString(edge.node.player_name ?? ""),
          player_score: edge.node.player_score,
          level: edge.node.level,
          round: edge.node.round,
        };
      })
  );

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

  processedEntries.forEach((entry) => {
    const playerId = signedHexToNumber(entry.id.toString());

    if (playerId === gameId) {
      currentGameEntry = entry;
    }

    const existing = leaderboardMap.get(entry.player_name);
    if (
      !existing ||
      entry.level > existing.level ||
      (entry.level === existing.level &&
        entry.player_score > existing.player_score)
    ) {
      leaderboardMap.set(entry.player_name, entry);
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

  const filteredLeaderboard = filterLoggedInPlayers
    ? sortedLeaderboard?.filter(
        (player) => !guestNamePattern.test(player.player_name)
      )
    : sortedLeaderboard;

  return filteredLeaderboard.map((leader, index) => ({
    ...leader,
    position: index + 1,
    prize: getPrize(index + 1),
  }));
};

export const useGetLeaderboard = (
  gameId?: number,
  filterLoggedInPlayers = true
) => {
  const { modId } = useGameStore();
  const {
    setup: { client },
  } = useDojo();

  const queryResponse = useQuery(
    [LEADERBOARD_QUERY_KEY, modId, gameId],
    () => fetchGraphQLData(modId, client, filterLoggedInPlayers, gameId),
    {
      refetchOnWindowFocus: false,
    }
  );

  return {
    ...queryResponse,
    data: queryResponse.data ?? [],
  };
};
