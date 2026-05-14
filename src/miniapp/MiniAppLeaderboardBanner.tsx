import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PodiumBannerCard } from "../pages/NewHome/banners/PodiumBannerCard";
import { useGetApiLeaderboard } from "../queries/useGetApiLeaderboard";
import { getCurrentGameLeaderboardPeriods } from "../utils/leaderboardPeriods";
import { getMiniAppBlockchain } from "./session/useMiniAppSession";

const useMiniAppPodiumLeaders = () => {
  const [now, setNow] = useState(() => new Date());
  const periods = useMemo(() => getCurrentGameLeaderboardPeriods(now), [now]);
  const { data } = useGetApiLeaderboard({
    blockchain: getMiniAppBlockchain(),
    startDate: periods.weekly.startDate,
    endDate: periods.weekly.endDate,
    isTournament: false,
    limit: 3,
  });

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, []);

  return useMemo(
    () =>
      (data?.entries ?? [])
        .slice(0, 3)
        .map((player) => player.displayName)
        .filter((playerName): playerName is string => Boolean(playerName)),
    [data?.entries]
  );
};

export const MiniAppLeaderboardBanner = () => {
  const { t } = useTranslation("home", {
    keyPrefix: "home.leaderboard-banner",
  });
  const navigate = useNavigate();
  const leaders = useMiniAppPodiumLeaders();

  return (
    <PodiumBannerCard
      leaders={leaders}
      title={t("title")}
      buttonLabel={t("button")}
      onButtonClick={() => navigate("/leaderboard")}
    />
  );
};
