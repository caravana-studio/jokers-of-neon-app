import { useEffect, useState } from "react";
import type { Prize } from "./useTournamentSettings";

interface ApiXpEvent {
  multiplier?: number;
  startDate?: string;
  finishDate?: string;
}

interface ApiSeason {
  number?: number;
  finishDate?: string;
  "xp-event"?: ApiXpEvent;
  "daily-prizes"?: ApiPrize[];
  "weekly-prizes"?: ApiPrize[];
  "season-prizes"?: ApiPrize[];
}

interface ApiPrize extends Prize {
  position: string;
}

export interface XpEvent {
  multiplier: number;
  startDate: Date | null;
  finishDate: Date | null;
}

export interface Season {
  number: number;
  finishDate: Date | null;
  xpEvent: XpEvent | null;
  dailyPrizes: Record<number, Prize>;
  weeklyPrizes: Record<number, Prize>;
  seasonPrizes: Record<number, Prize>;
}

const defaultSeason: Season = {
  number: 1,
  finishDate: null,
  xpEvent: null,
  dailyPrizes: {},
  weeklyPrizes: {},
  seasonPrizes: {},
};

const parseDateOrNull = (date?: string) => {
  if (!date) return null;
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const parseXpEvent = (event?: ApiXpEvent): XpEvent | null => {
  if (!event) return null;

  const startDate = parseDateOrNull(event.startDate);
  const finishDate = parseDateOrNull(event.finishDate);

  if (!startDate || !finishDate) return null;

  return {
    multiplier: event.multiplier ?? 1,
    startDate,
    finishDate,
  };
};

const parsePrizes = (prizes?: ApiPrize[]): Record<number, Prize> => {
  const parsedPrizes: Record<number, Prize> = {};

  prizes?.forEach((prize) => {
    if (prize.position.includes("-")) {
      const [start, end] = prize.position.split("-").map((value) => parseInt(value, 10));
      if (!Number.isFinite(start) || !Number.isFinite(end)) {
        return;
      }

      for (let position = start; position <= end; position += 1) {
        parsedPrizes[position] = prize;
      }
      return;
    }

    const position = parseInt(prize.position, 10);
    if (Number.isFinite(position) && position > 0) {
      parsedPrizes[position] = prize;
    }
  });

  return parsedPrizes;
};

export const useSeason = () => {
  const [season, setSeason] = useState<Season | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeason = async () => {
      try {
        const response = await fetch(
          "https://jokersofneon.com/app/settings/season.json"
        );
        if (!response.ok) {
          console.error("Failed to fetch season settings");
          setSeason(defaultSeason);
          return;
        }

        const data: ApiSeason = await response.json();
        setSeason({
          number: data.number ?? 0,
          finishDate: parseDateOrNull(data.finishDate),
          xpEvent: parseXpEvent(data["xp-event"]),
          dailyPrizes: parsePrizes(data["daily-prizes"]),
          weeklyPrizes: parsePrizes(data["weekly-prizes"]),
          seasonPrizes: parsePrizes(data["season-prizes"]),
        });
      } catch (err) {
        console.error(
          "Failed to fetch season settings. Unknown error occurred",
          err
        );
        setSeason(defaultSeason);
      } finally {
        setLoading(false);
      }
    };

    fetchSeason();
  }, []);

  return { season, loading };
};
