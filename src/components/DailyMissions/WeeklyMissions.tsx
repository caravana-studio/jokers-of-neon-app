import { Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getWeeklyMissions } from "../../dojo/queries/getDailyMissions";
import { useDojo } from "../../dojo/useDojo";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { DailyMission } from "../../types/DailyMissions";
import { WeeklyMissionEntry } from "./MissionEntries";

interface WeeklyMissionsProps {
  showTitle?: boolean;
  compacted?: boolean;
  missions?: DailyMission[];
  loading?: boolean;
}

export const WeeklyMissions = ({
  showTitle = true,
  compacted = false,
  missions,
  loading: loadingProp,
}: WeeklyMissionsProps) => {
  const [weeklyMissions, setWeeklyMissions] = useState<DailyMission[]>([]);
  const [loading, setLoading] = useState(loadingProp ?? missions === undefined);
  const { t } = useTranslation("home", {
    keyPrefix: "home",
  });
  const { t: tMissions } = useTranslation("intermediate-screens", {
    keyPrefix: "missions",
  });
  const { isSmallScreen } = useResponsiveValues();

  const {
    setup: { client },
    account: { account },
  } = useDojo();

  useEffect(() => {
    if (missions !== undefined) {
      setWeeklyMissions(missions);
      setLoading(loadingProp ?? false);
      return;
    }

    if (!account) {
      setWeeklyMissions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    getWeeklyMissions(client, account.address)
      .then((nextMissions) => {
        setWeeklyMissions(nextMissions);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [account, client, loadingProp, missions]);

  const sortedMissions = [...weeklyMissions].sort((a, b) => a.xp - b.xp);

  return (
    <Flex w="100%" flexDir="column" gap={compacted ? 1.5 : 2} overflow="hidden">
      {showTitle && (
        <Flex w="100%" justifyContent="space-between" alignItems="center" mb={1}>
          <Heading variant="italic" fontSize={isSmallScreen ? "sm" : "md"}>
            {t("weeklyMissions")}
          </Heading>
        </Flex>
      )}
      <Flex w="100%" flexDir="column" gap={compacted ? 1.5 : 1} overflow="hidden">
        {!loading && weeklyMissions.length === 0 ? (
          <Text fontSize={isSmallScreen ? "12px" : "14px"} color="gray.400">
            {t("noMissionsAvailable")}
          </Text>
        ) : (
          sortedMissions.map((mission, index) => (
            <WeeklyMissionEntry
              key={`weekly-${mission.missionId}-${index}`}
              mission={mission}
              xpLabel={tMissions("xp-label")}
              compacted={compacted}
            />
          ))
        )}
      </Flex>
    </Flex>
  );
};
