import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDailyMissions } from "../../../dojo/queries/getDailyMissions";
import { useDojo } from "../../../dojo/useDojo";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import { DailyMission } from "../../../types/DailyMissions";
import { getNextDailyMissionResetDate } from "../../../utils/missionsTimers";
import { RegularBanner } from "./RegularBanner";
import { useTranslation } from "react-i18next";
import { MissionRow } from "../../../components/DailyMissions/MissionRow";

export const DailyMissionsBanner = () => {
  const navigate = useNavigate();
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
  const date = getNextDailyMissionResetDate();
  const sortedMissions = [...dailyMissions].sort((a, b) => a.xp - b.xp);

  const { isSmallScreen } = useResponsiveValues();

  return (
    <RegularBanner
      title={t("dailyMissions")}
      date={date}
      onClick={() => navigate("/missions")}
    >
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
