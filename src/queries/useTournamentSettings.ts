import { useEffect, useState } from "react";

interface ApiPrize extends Prize {
  position: string;
}

export interface Prize {
  packs: {
    base: number;
    advanced: number;
    epic: number;
    legendary: number;
    collector: number;
    collectorXL: number;
  };
  seasonPass: boolean;
}

interface TournamentSettings {
  isActive: boolean;
  isFinished: boolean;
  startDate?: Date;
  endDate?: Date;
  justFinished?: boolean;
  startCountingAtGameId: number;
  prizes: Record<number, Prize>;
}

const defaultTournamentSettings: TournamentSettings = {
  isActive: false,
  isFinished: false,
  startCountingAtGameId: 0,
  prizes: {},
};

const CURRENT_DATE = new Date();

const getPrizes = (prizes: ApiPrize[]) => {
  const tournamentPrizes: Record<number, Prize> = {};
  prizes?.forEach((prize) => {
    if (prize.position.includes("-")) {
      const [start, end] = prize.position.split("-").map((p) => parseInt(p));
      for (let i = start; i <= end; i++) {
        tournamentPrizes[i] = prize;
      }
    } else {
      const position = parseInt(prize.position);
      if (position) {
        tournamentPrizes[position] = prize;
      }
    }
  });
  console.log("tournament prizes:", tournamentPrizes);
  return tournamentPrizes;
};

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
          isActive:
            data["isActive"] ??
            (data["startDate"] && new Date(data["startDate"]) < CURRENT_DATE),
          isFinished:
            data["finishDate"] && new Date(data["finishDate"]) < CURRENT_DATE,
          startDate: data["startDate"] && new Date(data["startDate"]),
          endDate: data["finishDate"] && new Date(data["finishDate"]),
          startCountingAtGameId: data["start-counting-at-game-id"] || 0,
          prizes: getPrizes(data["prizes"]),
        });
      } catch (err) {
        console.error(
          "Failed to fetch tournament settings. Unknown error occurred",
          err
        );
        return defaultTournamentSettings;
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, []);

  return {
    tournament,
    loading,
  };
};
