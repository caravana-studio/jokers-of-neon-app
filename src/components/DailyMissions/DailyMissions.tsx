import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getDailyMissions,
  getWeeklyMissions,
} from "../../dojo/queries/getDailyMissions";
import { useDojo } from "../../dojo/useDojo";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { DailyMission } from "../../types/DailyMissions";
import { MissionRow } from "./MissionRow";

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
  gameId?: number;
  refreshKey?: unknown;
}

export const DailyMissions = ({
  showTitle = true,
  fontSize,
  gameId,
  refreshKey,
}: DailyMissionsProps) => {
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>([]);
  const [weeklyMissions, setWeeklyMissions] = useState<DailyMission[]>([]);
  const [activePeriod, setActivePeriod] = useState<"daily" | "weekly">("daily");
  const { t } = useTranslation("home", {
    keyPrefix: "home",
  });
  const { isSmallScreen } = useResponsiveValues();

  const {
    setup: { client },
    account: { account },
  } = useDojo();

  useEffect(() => {
    if (!account) {
      setDailyMissions([]);
      setWeeklyMissions([]);
      return;
    }

    Promise.all([
      getDailyMissions(client, account.address, { gameId }),
      getWeeklyMissions(client, account.address),
    ]).then(([daily, weekly]) => {
      setDailyMissions(daily);
      setWeeklyMissions(weekly);
    });
  }, [account, client, gameId, refreshKey]);

  const sortedDailyMissions = [...dailyMissions].sort((a, b) => a.xp - b.xp);
  const sortedWeeklyMissions = [...weeklyMissions].sort((a, b) => a.xp - b.xp);
  const activeMissions =
    activePeriod === "daily" ? sortedDailyMissions : sortedWeeklyMissions;

  const renderMissionGroup = (title: string, missions: DailyMission[]) => {
    if (missions.length === 0) {
      return null;
    }

    return (
      <Flex w="100%" flexDir="column" gap={1} overflow="hidden">
        <Text
          fontSize={fontSize || (isSmallScreen ? "11px" : "12px")}
          color="whiteAlpha.700"
          textTransform="uppercase"
          fontFamily="Orbitron"
        >
          {title}
        </Text>
        {missions.map((mission) => (
          <MissionRow
            key={`${mission.periodType}-${mission.missionId}`}
            mission={mission}
            fontSize={fontSize}
          />
        ))}
      </Flex>
    );
  };

  return (
    <Flex w="100%" flexDir="column" gap={2} overflow="hidden">
      <Flex
        w="100%"
        justifyContent={showTitle ? "space-between" : "flex-end"}
        alignItems="center"
        mb={1}
      >
        {showTitle && (
          <Heading variant="italic" fontSize={fontSize || (isSmallScreen ? "sm" : "md")}>
            {t("dailyMissions")}
          </Heading>
        )}
        <Flex gap={1}>
          {(["daily", "weekly"] as const).map((period) => (
            <Button
              key={period}
              size="xs"
              variant={activePeriod === period ? "solid" : "outline"}
              onClick={() => setActivePeriod(period)}
            >
              {t(`dailyMissionGroups.${period}`)}
            </Button>
          ))}
        </Flex>
      </Flex>
      <Flex w="100%" flexDir="column" gap={1} overflow="hidden">
        {activeMissions.length === 0 ? (
          <Text
            fontSize={fontSize || (isSmallScreen ? "12px" : "14px")}
            color="gray.400"
          >
            {t("noMissionsAvailable")}
          </Text>
        ) : (
          renderMissionGroup(t(`dailyMissionGroups.${activePeriod}`), activeMissions)
        )}
      </Flex>
    </Flex>
  );
};
