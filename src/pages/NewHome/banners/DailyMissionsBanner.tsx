import { Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IconComponent } from "../../../components/IconComponent";
import { Icons } from "../../../constants/icons";
import { getDailyMissions } from "../../../dojo/queries/getDailyMissions";
import { useDojo } from "../../../dojo/useDojo";
import { VIOLET_LIGHT } from "../../../theme/colors";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import { DailyMission } from "../../../types/DailyMissions";
import { RegularBanner } from "./RegularBanner";
import { useTranslation } from "react-i18next";

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

  return (
    <RegularBanner title={t("dailyMissions")} date={date}>
      {dailyMissions.map((mission) => (
        <MissionRow mission={mission} />
      ))}
    </RegularBanner>
  );
};

const MissionRow = ({ mission }: { mission: DailyMission }) => {
  const { isSmallScreen } = useResponsiveValues();
  const size = isSmallScreen ? "20px" : "30px";

  const color = mission.completed ? VIOLET_LIGHT : "white";
  return (
    <Flex alignItems={"center"} gap={2} my={isSmallScreen ? 0 : 1}>
      <IconComponent
        icon={mission.completed ? Icons.CHECK : Icons.UNCHECK}
        width={size}
        height={size}
        color={color}
      />
      <Text fontSize={isSmallScreen ? "14px" : "18px"} color={color}>
        {mission.description} -
        <span style={{ fontFamily: "Orbitron" }}> {mission.xp} XP</span>
      </Text>
    </Flex>
  );
};
