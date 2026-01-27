import { gql } from "graphql-tag";
import { useQuery } from "react-query";
import { decodeString } from "../dojo/utils/decodeString";
import mainnetGraphQLClient from "../mainnetGraphQLClient";
import { signedHexToNumber } from "../utils/signedHexToNumber";
import { snakeToCamel } from "../utils/snakeToCamel";
import { useTournamentSettings } from "./useTournamentSettings";

export const LEADERBOARD_QUERY_KEY = "leaderboard";
const guestNamePattern = /^joker_guest_\d+$/;

const DOJO_NAMESPACE =
  import.meta.env.VITE_MAINNET_NAMESPACE || "jokers_of_neon_core";
const CAMEL_CASE_NAMESPACE = snakeToCamel(DOJO_NAMESPACE);
const QUERY_FIELD_NAME = `${CAMEL_CASE_NAMESPACE}GameDataModels`;

export const LEADERBOARD_QUERY = gql`
  query ($isTournament: Boolean!, $startCountingAtGameId: u64!) {
    ${QUERY_FIELD_NAME}(
      where: { is_tournament: $isTournament, idGT: $startCountingAtGameId }
      first: 10000
      order: { field: "LEVEL", direction: "DESC" }
    ) {
      edges {
        node {
          player_score
          level
          player_name
          id
          round
          is_tournament
        }
      }
    }
  }
`;

const GAME_TOURNAMENT_QUERY = gql`
  query ($gameId: u64!) {
    ${QUERY_FIELD_NAME}(where: { idEQ: $gameId }, first: 1) {
      edges {
        node {
          id
          is_tournament
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
    round: number;
    is_tournament: boolean;
  };
}

type LeaderboardResponse = Record<string, { edges: GameEdge[] }>;

interface GameTournamentEdge {
  node: {
    id: number;
    is_tournament: boolean;
  };
}

type GameTournamentResponse = Record<string, { edges?: GameTournamentEdge[] }>;

const fetchGameIsTournament = async (
  gameId?: number
): Promise<boolean | null> => {
  if (gameId === undefined || Number.isNaN(gameId)) {
    return null;
  }

  try {
    const rawData: GameTournamentResponse = await mainnetGraphQLClient.request(
      GAME_TOURNAMENT_QUERY,
      {
        gameId: gameId.toString(),
      }
    );

    const node = rawData?.[QUERY_FIELD_NAME]?.edges?.[0]?.node;
    if (typeof node?.is_tournament === "boolean") {
      return node.is_tournament;
    }
  } catch (error) {
    console.error("Failed to fetch game tournament flag", error);
  }

  return null;
};

const fetchGraphQLData = async (
  filterLoggedInPlayers: boolean,
  gameId?: number,
  isTournament: boolean = false,
  startCountingAtGameId: number = 0
) => {
  const resolvedIsTournament =
    gameId !== undefined ? await fetchGameIsTournament(gameId) : null;
  const effectiveIsTournament = resolvedIsTournament ?? isTournament;

  const rawData: LeaderboardResponse = await mainnetGraphQLClient.request(
    LEADERBOARD_QUERY,
    {
      isTournament: effectiveIsTournament,
      startCountingAtGameId,
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
    if (a.round !== b.round) {
      return b.round - a.round;
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
  }));
};

export const useGetLeaderboard = (
  gameId?: number,
  filterLoggedInPlayers = true,
  isTournament = false
) => {
  const { tournament, loading: tournamentLoading } = useTournamentSettings();
  const startCountingAtGameId =
    (!tournamentLoading &&
      Number(tournament?.startCountingAtGameId ?? 0)) ||
    0;

  const queryResponse = useQuery(
    [LEADERBOARD_QUERY_KEY, gameId, isTournament, startCountingAtGameId],
    () =>
      fetchGraphQLData(
        filterLoggedInPlayers,
        gameId,
        isTournament,
        startCountingAtGameId
      ),
    {
      refetchOnWindowFocus: false,
      enabled: !tournamentLoading,
    }
  );

  return {
    ...queryResponse,
    data: queryResponse.data ?? [],
  };
};
