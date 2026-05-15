import { useQuery } from "react-query";
import { getGameApiBaseUrl } from "../config/gameApiUrl";

export const API_LEADERBOARD_QUERY_KEY = "api-leaderboard";

type ApiLeaderboardResponse = {
  success?: boolean;
  data?: {
    blockchain?: string;
    start_game_id?: number | string | null;
    end_game_id?: number | string | null;
    date_range?: {
      start?: string;
      end?: string;
    };
    entries?: Array<{
      position?: number | string | null;
      id?: number | string | null;
      owner?: string | null;
      username?: string | null;
      display_name?: string | null;
      player_name?: string | null;
      player_score?: number | string | null;
      cash?: number | string | null;
      round?: number | string | null;
      is_tournament?: boolean | null;
      level?: number | string | null;
    }>;
    total_games?: number | string | null;
    filtered_games?: number | string | null;
    total_players?: number | string | null;
    filters?: {
      is_tournament?: boolean;
      limit?: number | string | null;
    };
  };
};

export type ApiLeaderboardEntry = {
  position: number;
  id: number;
  owner: string;
  username: string | null;
  displayName: string;
  playerName: string;
  playerScore: number;
  cash: number;
  round: number;
  isTournament: boolean;
  level: number;
};

export type ApiLeaderboardData = {
  blockchain: string;
  startGameId: number | null;
  endGameId: number | null;
  dateRange: {
    start: string | null;
    end: string | null;
  };
  entries: ApiLeaderboardEntry[];
  totalGames: number;
  filteredGames: number;
  totalPlayers: number;
  filters: {
    isTournament: boolean;
    limit: number;
  };
};

type UseGetApiLeaderboardParams = {
  blockchain: string;
  startDate: string;
  endDate: string;
  isTournament?: boolean;
  limit?: number;
  enabled?: boolean;
};

const toNumber = (value?: number | string | null, fallback = 0) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return parsed;
};

const fetchApiLeaderboard = async ({
  blockchain,
  startDate,
  endDate,
  isTournament = false,
  limit = 50,
}: UseGetApiLeaderboardParams): Promise<ApiLeaderboardData> => {
  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  if (!apiKey) {
    throw new Error(
      "fetchApiLeaderboard: Missing VITE_GAME_API_KEY environment variable"
    );
  }

  const params = new URLSearchParams({
    blockchain,
    start_date: startDate,
    end_date: endDate,
    is_tournament: String(isTournament),
    limit: String(limit),
  });

  const response = await fetch(
    `${getGameApiBaseUrl()}/api/stats/leaderboard?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
      },
    }
  );

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `fetchApiLeaderboard: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  const json: ApiLeaderboardResponse = await response.json();
  const data = json.data;

  if (!json.success || !data) {
    throw new Error(
      "fetchApiLeaderboard: API responded without a valid leaderboard payload"
    );
  }

  return {
    blockchain: data.blockchain ?? blockchain,
    startGameId: Number.isFinite(Number(data.start_game_id))
      ? Number(data.start_game_id)
      : null,
    endGameId: Number.isFinite(Number(data.end_game_id))
      ? Number(data.end_game_id)
      : null,
    dateRange: {
      start: data.date_range?.start ?? null,
      end: data.date_range?.end ?? null,
    },
    entries: (data.entries ?? []).map((entry) => {
      const displayName =
        entry.display_name?.trim() ||
        entry.player_name?.trim() ||
        entry.username?.trim() ||
        entry.owner?.trim() ||
        "Unknown";

      return {
        position: Math.max(1, Math.floor(toNumber(entry.position, 0))),
        id: Math.max(0, Math.floor(toNumber(entry.id, 0))),
        owner: entry.owner?.trim() ?? "",
        username: entry.username?.trim() ?? null,
        displayName,
        playerName: entry.player_name?.trim() || displayName,
        playerScore: Math.max(0, Math.floor(toNumber(entry.player_score, 0))),
        cash: Math.max(0, Math.floor(toNumber(entry.cash, 0))),
        round: Math.max(0, Math.floor(toNumber(entry.round, 0))),
        isTournament: Boolean(entry.is_tournament),
        level: Math.max(0, Math.floor(toNumber(entry.level, 0))),
      };
    }),
    totalGames: Math.max(0, Math.floor(toNumber(data.total_games, 0))),
    filteredGames: Math.max(0, Math.floor(toNumber(data.filtered_games, 0))),
    totalPlayers: Math.max(0, Math.floor(toNumber(data.total_players, 0))),
    filters: {
      isTournament: Boolean(data.filters?.is_tournament),
      limit: Math.max(0, Math.floor(toNumber(data.filters?.limit, limit))),
    },
  };
};

export const useGetApiLeaderboard = ({
  blockchain,
  startDate,
  endDate,
  isTournament = false,
  limit = 50,
  enabled = true,
}: UseGetApiLeaderboardParams) => {
  const queryResponse = useQuery(
    [
      API_LEADERBOARD_QUERY_KEY,
      blockchain,
      startDate,
      endDate,
      isTournament,
      limit,
    ],
    () =>
      fetchApiLeaderboard({
        blockchain,
        startDate,
        endDate,
        isTournament,
        limit,
      }),
    {
      enabled: enabled && Boolean(blockchain && startDate && endDate),
      refetchOnWindowFocus: false,
    }
  );

  return {
    ...queryResponse,
    data: queryResponse.data ?? null,
  };
};
