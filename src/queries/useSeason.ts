import { useEffect, useState } from "react";

interface ApiSeason {
  number?: number;
  finishDate?: string;
}

export interface Season {
  number: number;
  finishDate: Date | null;
}

const defaultSeason: Season = {
  number: 1,
  finishDate: null,
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
          finishDate: data.finishDate ? new Date(data.finishDate) : null,
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
