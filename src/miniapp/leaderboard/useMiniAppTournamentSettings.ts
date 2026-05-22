import { useQuery } from "react-query";

export const MINI_APP_TOURNAMENT_SETTINGS_QUERY_KEY =
  "miniapp-tournament-settings";

type ApiMiniAppTournamentPrize = {
  position?: string | null;
  token?: {
    amount?: number | string | null;
    type?: string | null;
  } | null;
};

type ApiMiniAppTournamentSettings = {
  isActive?: boolean | null;
  startDate?: string | null;
  finishDate?: string | null;
  prizes?: ApiMiniAppTournamentPrize[] | null;
};

export type MiniAppTournamentPrize = {
  token: {
    amount: number;
    type: string;
  };
};

export type MiniAppTournamentSettings = {
  isActive: boolean;
  startDate: Date | null;
  finishDate: Date | null;
  prizes: Record<number, MiniAppTournamentPrize>;
};

const MINI_APP_TOURNAMENT_SETTINGS_URL =
  "https://jokersofneon.com/app/settings/miniapp-tournament.json";

const defaultMiniAppTournamentSettings: MiniAppTournamentSettings = {
  isActive: false,
  startDate: null,
  finishDate: null,
  prizes: {},
};

const toNumber = (value?: number | string | null) => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
};

const parseDate = (value?: string | null) => {
  if (!value?.trim()) {
    return null;
  }

  const parsedDate = new Date(value);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const parsePrizes = (
  prizes?: ApiMiniAppTournamentPrize[] | null
): Record<number, MiniAppTournamentPrize> => {
  const parsedPrizes: Record<number, MiniAppTournamentPrize> = {};

  prizes?.forEach((prize) => {
    const amount = toNumber(prize.token?.amount);
    const type = prize.token?.type?.trim();
    const position = prize.position?.trim();

    if (!position || amount === null || !type) {
      return;
    }

    const parsedPrize: MiniAppTournamentPrize = {
      token: {
        amount,
        type,
      },
    };

    if (position.includes("-")) {
      const [start, end] = position.split("-").map((value) => Number(value));

      if (!Number.isFinite(start) || !Number.isFinite(end)) {
        return;
      }

      for (let currentPosition = start; currentPosition <= end; currentPosition += 1) {
        parsedPrizes[currentPosition] = parsedPrize;
      }

      return;
    }

    const parsedPosition = Number(position);

    if (Number.isFinite(parsedPosition) && parsedPosition > 0) {
      parsedPrizes[parsedPosition] = parsedPrize;
    }
  });

  return parsedPrizes;
};

const fetchMiniAppTournamentSettings =
  async (): Promise<MiniAppTournamentSettings> => {
    try {
      const response = await fetch(MINI_APP_TOURNAMENT_SETTINGS_URL);

      if (!response.ok) {
        console.error("Failed to fetch mini app tournament settings");
        return defaultMiniAppTournamentSettings;
      }

      const data: ApiMiniAppTournamentSettings = await response.json();

      return {
        isActive: Boolean(data.isActive),
        startDate: parseDate(data.startDate),
        finishDate: parseDate(data.finishDate),
        prizes: parsePrizes(data.prizes),
      };
    } catch (error) {
      console.error("Failed to fetch mini app tournament settings", error);
      return defaultMiniAppTournamentSettings;
    }
  };

export const useMiniAppTournamentSettings = () => {
  const query = useQuery(
    [MINI_APP_TOURNAMENT_SETTINGS_QUERY_KEY],
    fetchMiniAppTournamentSettings,
    {
      refetchOnWindowFocus: false,
    }
  );

  return {
    ...query,
    tournament: query.data ?? defaultMiniAppTournamentSettings,
  };
};
