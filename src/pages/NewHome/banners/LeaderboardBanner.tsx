import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PodiumBannerCard } from "./PodiumBannerCard";
import { usePodiumLeaders } from "./usePodiumLeaders";

export const LeaderboardBanner = () => {
  const { t } = useTranslation("home", {
    keyPrefix: "home.leaderboard-banner",
  });
  const navigate = useNavigate();
  const { leaders } = usePodiumLeaders();

  return (
    <PodiumBannerCard
      leaders={leaders}
      title={t("title")}
      buttonLabel={t("button")}
      onButtonClick={() => navigate("/leaderboard")}
    />
  );
};
