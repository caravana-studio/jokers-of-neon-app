import { useEffect, useState } from "react";

interface TournamentSettings {
  isActive: boolean;
  isFinished: boolean;
  startDate?: Date;
  endDate?: Date;
  justFinished?: boolean;
  startCountingAtGameId: number;
  stopCountingAtGameId: number;
}

const defaultTournamentSettings: TournamentSettings = {
  isActive: false,
  isFinished: false,
  startCountingAtGameId: 0,
  stopCountingAtGameId: 1000000,
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
          isActive: data["isActive"] ?? (data["startDate"] && new Date(data["startDate"]) < CURRENT_DATE),
          isFinished: data["finishDate"] && new Date(data["finishDate"]) < CURRENT_DATE,
          startDate: data["startDate"] && new Date(data["startDate"]),
          endDate: data["finishDate"] && new Date(data["finishDate"]),
          startCountingAtGameId: data["start-counting-at-game-id"] || 0,
          stopCountingAtGameId: data["stop-counting-at-game-id"] || 1000000,
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
