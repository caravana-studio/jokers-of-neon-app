import { Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getDailyMissions } from "../../dojo/queries/getDailyMissions";
import { useDojo } from "../../dojo/useDojo";
import { VIOLET_LIGHT } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { DailyMission } from "../../types/DailyMissions";
import { IconComponent } from "../IconComponent";
import { Icons } from "../../constants/icons";
import { Clock } from "../Clock";

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

interface DailyMissionsProps {
  showTitle?: boolean;
  fontSize?: string;
}

export const DailyMissions = ({ showTitle = true, fontSize }: DailyMissionsProps) => {
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>([]);
  const { t } = useTranslation("home", {
    keyPrefix: "home",
  });
  const { isSmallScreen } = useResponsiveValues();

  const {
    setup: { client },
    account: { account },
  } = useDojo();

  useEffect(() => {
    account &&
      getDailyMissions(client, account.address).then((missions) => {
        setDailyMissions(missions);
      });
  }, [account, client]);

  const date = getNextResetDate();

  return (
    <Flex w="100%" flexDir="column" gap={2} overflow="hidden">
      {showTitle && (
        <Flex w="100%" justifyContent="space-between" alignItems="center" mb={1}>
          <Heading variant="italic" fontSize={fontSize || (isSmallScreen ? "sm" : "md")}>
            {t("dailyMissions")}
          </Heading>
        </Flex>
      )}
      <Flex w="100%" flexDir="column" gap={1.5} overflow="hidden">
        {dailyMissions.length === 0 ? (
          <Text fontSize={fontSize || (isSmallScreen ? "12px" : "14px")} color="gray.400">
            No missions available
          </Text>
        ) : (
          dailyMissions.map((mission, index) => (
            <MissionRow key={index} mission={mission} fontSize={fontSize} />
          ))
        )}
      </Flex>
    </Flex>
  );
};

const MissionRow = ({ mission, fontSize }: { mission: DailyMission; fontSize?: string }) => {
  const { isSmallScreen } = useResponsiveValues();
  const size = isSmallScreen ? "18px" : "20px";

  const color = mission.completed ? VIOLET_LIGHT : "white";
  return (
    <Flex alignItems="center" gap={2} my={0}>
      <IconComponent
        icon={mission.completed ? Icons.CHECK : Icons.UNCHECK}
        width={size}
        height={size}
        color={color}
      />
      <Text fontSize={fontSize || (isSmallScreen ? "12px" : "14px")} color={color} lineHeight="1.4">
        {mission.description} -
        <span style={{ fontFamily: "Orbitron" }}> {mission.xp} XP</span>
      </Text>
    </Flex>
  );
};
