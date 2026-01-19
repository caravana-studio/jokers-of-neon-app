import { useEffect, useState } from "react";

interface ApiXpEvent {
  multiplier?: number;
  startDate?: string;
  finishDate?: string;
}

interface ApiSeason {
  number?: number;
  finishDate?: string;
  "xp-event"?: ApiXpEvent;
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
}

const defaultSeason: Season = {
  number: 1,
  finishDate: null,
  xpEvent: null,
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
