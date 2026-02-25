import { useQuery } from "react-query";

const DEFAULT_API_BASE_URL = "http://localhost:3001";
export const GAME_ID_RANGE_QUERY_KEY = "game-id-range";

type GameIdRangeApiResponse = {
  success?: boolean;
  data?: {
    start_game_id?: number | string | null;
    end_game_id?: number | string | null;
    date_range?: {
      start?: string;
      end?: string;
    };
  };
};

export type GameIdRange = {
  startGameId: number | null;
  endGameId: number | null;
  dateRange: {
    start: string | null;
    end: string | null;
  };
};

const toGameIdNumber = (value?: number | string | null) => {
  if (value === null || value === undefined) {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return Math.floor(parsed);
};

const fetchGameIdRange = async (
  startDate: string,
  endDate: string
): Promise<GameIdRange> => {
  const baseUrl =
    import.meta.env.VITE_GAME_API_URL?.replace(/\/$/, "") ||
    DEFAULT_API_BASE_URL;

  const params = new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
  });

  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  const headers: Record<string, string> = {};

  if (apiKey) {
    headers["X-API-Key"] = apiKey;
  }

  const response = await fetch(`${baseUrl}/api/stats/game-id-range?${params}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `fetchGameIdRange: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  const json: GameIdRangeApiResponse = await response.json();

  if (!json.success || !json.data) {
    throw new Error(
      "fetchGameIdRange: API responded without a valid range payload"
    );
  }

  return {
    startGameId: toGameIdNumber(json.data.start_game_id),
    endGameId: toGameIdNumber(json.data.end_game_id),
    dateRange: {
      start: json.data.date_range?.start ?? null,
      end: json.data.date_range?.end ?? null,
    },
  };
};

export const useGameIdRange = (
  startDate?: string,
  endDate?: string
) => {
  const enabled = Boolean(startDate && endDate);

  const queryResponse = useQuery(
    [GAME_ID_RANGE_QUERY_KEY, startDate, endDate],
    () => fetchGameIdRange(startDate!, endDate!),
    {
      enabled,
      refetchOnWindowFocus: false,
    }
  );

  return {
    ...queryResponse,
    data: queryResponse.data ?? null,
  };
};
