import { useEffect, useState } from "react";
import { getDailyMissions } from "../../../dojo/queries/getDailyMissions";
import { useDojo } from "../../../dojo/useDojo";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import { DailyMission } from "../../../types/DailyMissions";
import { RegularBanner } from "./RegularBanner";
import { useTranslation } from "react-i18next";
import { MissionRow } from "../../../components/DailyMissions/MissionRow";

const RESET_TIME = import.meta.env.VITE_RESET_TIME_UTC || "6";

function getNextResetDate() {
  const now = new Date();

  const reset = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      Number(RESET_TIME),
      0,
      0,
      0
    )
  );

  if (now >= reset) {
    reset.setUTCDate(reset.getUTCDate() + 1);
  }

  return reset;
}

export const DailyMissionsBanner = () => {
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>([]);
  const { t } = useTranslation("home", {
    keyPrefix: "home",
  });

  const {
    setup: { client },
    account: { account },
  } = useDojo();

  useEffect(() => {
    account &&
      getDailyMissions(client, account.address).then((missions) => {
        setDailyMissions(missions);
      });
  }, []);
  const date = getNextResetDate();
  const sortedMissions = [...dailyMissions].sort((a, b) => a.xp - b.xp);

  const { isSmallScreen } = useResponsiveValues();

  return (
    <RegularBanner title={t("dailyMissions")} date={date}>
      {sortedMissions.map((mission) => (
        <MissionRow
          key={mission.description}
          mission={mission}
          fontSize={isSmallScreen ? "14px" : "18px"}
          iconSize={isSmallScreen ? "20px" : "30px"}
        />
      ))}
    </RegularBanner>
  );
};
