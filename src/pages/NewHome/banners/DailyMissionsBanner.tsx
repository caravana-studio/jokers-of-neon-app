import { Button, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  getDailyMissions,
  getWeeklyMissions,
} from "../../../dojo/queries/getDailyMissions";
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

function getNextWeeklyResetDate() {
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
  const daysUntilMonday = (8 - reset.getUTCDay()) % 7;

  reset.setUTCDate(reset.getUTCDate() + daysUntilMonday);

  if (now >= reset) {
    reset.setUTCDate(reset.getUTCDate() + 7);
  }

  return reset;
}

export const DailyMissionsBanner = () => {
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>([]);
  const [weeklyMissions, setWeeklyMissions] = useState<DailyMission[]>([]);
  const [activePeriod, setActivePeriod] = useState<"daily" | "weekly">("daily");
  const { t } = useTranslation("home", {
    keyPrefix: "home",
  });

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
      getDailyMissions(client, account.address),
      getWeeklyMissions(client, account.address),
    ]).then(([daily, weekly]) => {
      setDailyMissions(daily);
      setWeeklyMissions(weekly);
    });
  }, [account, client]);

  const date =
    activePeriod === "daily" ? getNextResetDate() : getNextWeeklyResetDate();
  const activeMissions =
    activePeriod === "daily" ? dailyMissions : weeklyMissions;
  const sortedMissions = [...activeMissions].sort((a, b) => a.xp - b.xp);
  const title =
    activePeriod === "daily" ? t("dailyMissions") : t("weeklyMissions");

  const { isSmallScreen } = useResponsiveValues();

  return (
    <RegularBanner title={title} date={date}>
      <Flex gap={1} mb={1}>
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
      {sortedMissions.length === 0 ? (
        <Text fontSize={isSmallScreen ? "12px" : "14px"} color="gray.400">
          {t("noMissionsAvailable")}
        </Text>
      ) : (
        sortedMissions.map((mission) => (
          <MissionRow
            key={`${mission.periodType}-${mission.missionId}`}
            mission={mission}
            fontSize={isSmallScreen ? "14px" : "18px"}
            iconSize={isSmallScreen ? "20px" : "30px"}
          />
        ))
      )}
    </RegularBanner>
  );
};
