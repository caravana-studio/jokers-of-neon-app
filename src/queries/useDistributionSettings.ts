import { useEffect, useState } from "react";
import defaultDistribution from "./defaultDistribution.json";
export enum BannerType {
  DAILY_MISSIONS = "DAILY_MISSIONS",
  LEADERBOARD = "LEADERBOARD",
  PACKS = "PACKS",
  IMAGE = "image",
  TOURNAMENT = "TOURNAMENT",
}

export interface Banner {
  id: string;
  position: number;
  type: BannerType;
  url?: string;
  navigateTo?: string;
  packs?: number[];
  endTime?: string;
}

interface DistributionSettings {
  home: {
    banners: Banner[];
  };
  miniapp?: {
    banners: Banner[];
  };
}

export const useDistributionSettings = () => {
  const [settings, setSettings] = useState<DistributionSettings>(
    defaultDistribution as DistributionSettings
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(
          "https://jokersofneon.com/app/settings/distribution.json"
        );
        if (!response.ok) {
          console.error("Failed to fetch distribution settings");
          setSettings(defaultDistribution as DistributionSettings);
          return;
        }
        const data = await response.json();
        setSettings(data);
        console.log("Distribution settings:", data);
      } catch (err) {
        console.error(
          "Failed to fetch distribution settings. Unknown error occurred", err
        );
        setSettings(defaultDistribution as DistributionSettings);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading };
};
