import { Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getDailyMissions } from "../../dojo/queries/getDailyMissions";
import { useDojo } from "../../dojo/useDojo";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { DailyMission } from "../../types/DailyMissions";
import { DailyMissionEntry } from "./MissionEntries";
import { MissionRow } from "./MissionRow";

interface DailyMissionsProps {
  showTitle?: boolean;
  fontSize?: string;
  compacted?: boolean;
  missions?: DailyMission[];
  loading?: boolean;
}

export const DailyMissions = ({
  showTitle = true,
  fontSize,
  compacted = false,
  missions,
  loading: loadingProp,
}: DailyMissionsProps) => {
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>([]);
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
      setDailyMissions(missions);
      setLoading(loadingProp ?? false);
      return;
    }

    if (!account) {
      setDailyMissions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    getDailyMissions(client, account.address)
      .then((nextMissions) => {
        setDailyMissions(nextMissions);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [account, client, loadingProp, missions]);

  const sortedMissions = [...dailyMissions].sort((a, b) => a.xp - b.xp);

  return (
    <Flex w="100%" flexDir="column" gap={compacted ? 1.5 : 2} overflow="hidden">
      {showTitle && (
        <Flex w="100%" justifyContent="space-between" alignItems="center" mb={1}>
          <Heading variant="italic" fontSize={fontSize || (isSmallScreen ? "sm" : "md")}>
            {t("dailyMissions")}
          </Heading>
        </Flex>
      )}
      <Flex w="100%" flexDir="column" gap={compacted ? 1.5 : 1} overflow="hidden">
        {!loading && dailyMissions.length === 0 ? (
          <Text fontSize={fontSize || (isSmallScreen ? "12px" : "14px")} color="gray.400">
            {t("noMissionsAvailable")}
          </Text>
        ) : (
          sortedMissions.map((mission, index) => (
            compacted ? (
              <DailyMissionEntry
                key={`daily-${mission.missionId}-${index}`}
                mission={mission}
                xpLabel={tMissions("xp-label")}
                compacted
                completed={mission.completed}
              />
            ) : (
              <MissionRow key={index} mission={mission} fontSize={fontSize} />
            )
          ))
        )}
      </Flex>
    </Flex>
  );
};
