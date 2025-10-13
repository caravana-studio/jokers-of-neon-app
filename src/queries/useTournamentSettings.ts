import { useEffect, useState } from "react";

interface TournamentSettings {
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  justFinished?: boolean;
  startCountingAtGameId: number;
}

const defaultTournamentSettings: TournamentSettings = {
  isActive: false,
  startCountingAtGameId: 0,
}

const CURRENT_DATE = new Date();

export const useTournamentSettings = () => {
  const [tournament, setTournament] = useState<TournamentSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const response = await fetch(
          "https://jokersofneon.com/app/settings/tournament.json"
        );
        if (!response.ok) {
          console.error("Failed to fetch tournament settings");
          return defaultTournamentSettings;
        }
        const data = await response.json();

        setTournament({
          isActive: data["start-date"] && new Date(data["start-date"]) < CURRENT_DATE,
          startDate: data["start-date"] && new Date(data["start-date"]),
          endDate: data["finsish-date"] && new Date(data["finsish-date"]),
          startCountingAtGameId: data["start-counting-at-game-id"] || 0,
        });
        console.log("tournament settings:", data);
      } catch (err) {
        console.error(
          "Failed to fetch tournament settings. Unknown error occurred", err
        );
        return defaultTournamentSettings;
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, []);

  return { tournament, loading };
};
