import { gql } from "graphql-tag";
import { useQuery } from "react-query";
import { resolveUsernameMap } from "../api/usernames";
import { decodeString } from "../dojo/utils/decodeString";
import mainnetGraphQLClient from "../mainnetGraphQLClient";
import { normalizeGameId } from "../utils/normalizeGameId";
import { snakeToCamel } from "../utils/snakeToCamel";
import { addressKey, formatAddress } from "../utils/starknetAddress";
import { useTournamentSettings } from "./useTournamentSettings";

export const LEADERBOARD_QUERY_KEY = "leaderboard";
const guestNamePattern = /^(joker_guest_\d+|guest_[a-z0-9]+)$/i;
const excludedNamePattern = /^chichilo\d+$/i;

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
          owner
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
          player_score
          level
          player_name
          round
          is_tournament
          owner
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
    id: string | number;
    round: number;
    is_tournament: boolean;
    owner: string;
  };
}

type LeaderboardResponse = Record<string, { edges: GameEdge[] }>;

interface GameTournamentEdge {
  node: GameEdge["node"];
}

type GameTournamentResponse = Record<string, { edges?: GameTournamentEdge[] }>;

export interface LeaderboardQueryOptions {
  startGameId?: number | null;
  endGameId?: number | null;
  enabled?: boolean;
}

const parseGameId = (value?: string | number | null): number | null => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  const parsed = normalized.startsWith("0x")
    ? parseInt(normalized, 16)
    : Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
};

const mapLeaderboardEntry = (node: GameEdge["node"]) => ({
  id: node.id,
  player_name: decodeString(node.player_name ?? ""),
  player_score: node.player_score,
  level: node.level,
  round: node.round,
  wallet: node.owner,
  isTournament: node.is_tournament,
});

type LeaderboardEntry = ReturnType<typeof mapLeaderboardEntry> & {
  position?: number;
};

async function applyUsernameDisplayNames(
  entries: LeaderboardEntry[]
): Promise<LeaderboardEntry[]> {
  const usernameMap = await resolveUsernameMap(entries.map((entry) => entry.wallet)).catch(
    () => new Map<string, string>()
  );

  return entries.map((entry) => ({
    ...entry,
    player_name:
      usernameMap.get(addressKey(entry.wallet)) ||
      entry.player_name ||
      formatAddress(entry.wallet, 6),
  }));
}

const isExcludedLeaderboardName = (playerName?: string) =>
  Boolean(playerName && excludedNamePattern.test(playerName.trim()));

const fetchGameNode = async (
  gameId?: string | number
): Promise<GameEdge["node"] | null> => {
  const normalizedGameId = normalizeGameId(gameId);
  if (!normalizedGameId) {
    return null;
  }

  try {
    const rawData: GameTournamentResponse = await mainnetGraphQLClient.request(
      GAME_TOURNAMENT_QUERY,
      {
        gameId: normalizedGameId,
      }
    );

    return rawData?.[QUERY_FIELD_NAME]?.edges?.[0]?.node ?? null;
  } catch (error) {
    console.error("Failed to fetch current game data", error);
  }

  return null;
};

const fetchGraphQLData = async (
  filterLoggedInPlayers: boolean,
  gameId?: string | number,
  isTournament: boolean = false,
  startCountingAtGameId: number = 0,
  startGameId?: number | null,
  endGameId?: number | null
) => {
  const normalizedStartGameId =
    startGameId !== null &&
    startGameId !== undefined &&
    Number.isFinite(startGameId)
      ? Math.max(0, Math.floor(startGameId))
      : undefined;
  const normalizedEndGameId =
    endGameId !== null && endGameId !== undefined && Number.isFinite(endGameId)
      ? Math.max(0, Math.floor(endGameId))
      : undefined;

  const effectiveStartCountingAtGameId = Math.max(
    startCountingAtGameId,
    normalizedStartGameId !== undefined ? normalizedStartGameId - 1 : 0
  );

  const normalizedCurrentGameId = normalizeGameId(gameId);
  const currentGameNode =
    gameId !== undefined ? await fetchGameNode(gameId) : null;
  const effectiveIsTournament = currentGameNode?.is_tournament ?? isTournament;

  const rawData: LeaderboardResponse = await mainnetGraphQLClient.request(
    LEADERBOARD_QUERY,
    {
      isTournament: effectiveIsTournament,
      startCountingAtGameId: effectiveStartCountingAtGameId,
    }
  );

  const edges = (rawData?.[QUERY_FIELD_NAME]?.edges ?? []).filter((edge) => {
    const parsedGameId = parseGameId(edge.node.id);

    if (parsedGameId === null) {
      return false;
    }

    if (
      normalizedStartGameId !== undefined &&
      parsedGameId < normalizedStartGameId
    ) {
      return false;
    }

    if (normalizedEndGameId !== undefined && parsedGameId > normalizedEndGameId) {
      return false;
    }

    return true;
  });

  const mappedEntries = edges
    .filter((edge) => edge.node.player_score > 0)
    .map((edge) => mapLeaderboardEntry(edge.node));

  const mappedCurrentGameEntry = currentGameNode
    ? mapLeaderboardEntry(currentGameNode)
    : null;

  const entriesWithDisplayNames = await applyUsernameDisplayNames(
    mappedCurrentGameEntry
      ? [...mappedEntries, mappedCurrentGameEntry]
      : mappedEntries
  );

  const processedEntries = mappedEntries.map((entry, index) => entriesWithDisplayNames[index]);

  const leaderboardMap = new Map<
    string,
    {
      id: string | number;
      player_name: string;
      player_score: number;
      level: number;
      round: number;
      wallet: string;
      isTournament: boolean;
    }
  >();

  let currentGameEntry: {
    id: string | number;
    player_name: string;
    player_score: number;
    level: number;
    round: number;
    wallet: string;
    isTournament: boolean;
  } | null = null;

  if (mappedCurrentGameEntry) {
    const displayCurrentGameEntry = entriesWithDisplayNames[entriesWithDisplayNames.length - 1];
    currentGameEntry = isExcludedLeaderboardName(displayCurrentGameEntry.player_name)
      ? null
      : displayCurrentGameEntry;
  }

  processedEntries.forEach((entry) => {
    if (isExcludedLeaderboardName(entry.player_name)) {
      return;
    }

    const playerId = normalizeGameId(entry.id);

    if (playerId && playerId === normalizedCurrentGameId) {
      currentGameEntry = entry;
    }

    const playerKey = addressKey(entry.wallet) || entry.player_name;
    const existing = leaderboardMap.get(playerKey);
    if (
      !existing ||
      entry.level > existing.level ||
      (entry.level === existing.level &&
        entry.player_score > existing.player_score)
    ) {
      leaderboardMap.set(playerKey, entry);
    }
  });

  const leaderboardArray = Array.from(leaderboardMap.values());

  if (
    currentGameEntry &&
    !leaderboardArray.some(
      (entry) =>
        normalizeGameId(entry.id) === normalizeGameId(currentGameEntry!.id)
    )
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
  gameId?: string | number,
  filterLoggedInPlayers = true,
  isTournament = false,
  options?: LeaderboardQueryOptions
) => {
  const { tournament, loading: tournamentLoading } = useTournamentSettings();
  const startCountingAtGameId =
    (!tournamentLoading &&
      Number(tournament?.startCountingAtGameId ?? 0)) ||
    0;

  const queryResponse = useQuery(
    [
      LEADERBOARD_QUERY_KEY,
      gameId,
      isTournament,
      startCountingAtGameId,
      options?.startGameId ?? null,
      options?.endGameId ?? null,
    ],
    () =>
      fetchGraphQLData(
        filterLoggedInPlayers,
        gameId,
        isTournament,
        startCountingAtGameId,
        options?.startGameId,
        options?.endGameId
      ),
    {
      refetchOnWindowFocus: false,
      enabled: !tournamentLoading && (options?.enabled ?? true),
    }
  );

  return {
    ...queryResponse,
    data: queryResponse.data ?? [],
  };
};
