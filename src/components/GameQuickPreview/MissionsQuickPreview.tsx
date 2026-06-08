import { Flex } from "@chakra-ui/react";
import { useMemo } from "react";
import { MissionsPanels } from "../Missions/MissionsPanels";
import { useMissionsData } from "../../hooks/useMissionsData";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import {
  getNextDailyMissionResetDate,
  getNextWeeklyMissionResetDate,
} from "../../utils/missionsTimers";
import { Loading } from "../Loading";

export const MissionsQuickPreview = () => {
  const { isSmallScreen } = useResponsiveValues();
  const { dailyMissions, weeklyMissions, loading } = useMissionsData({
    inGame: true,
  });

  const dailyResetAt = useMemo(
    () => getNextDailyMissionResetDate(new Date()),
    [],
  );
  const weeklyResetAt = useMemo(
    () => getNextWeeklyMissionResetDate(new Date()),
    [],
  );
  const previewHeight = isSmallScreen ? "auto" : "min(72vh, 680px)";

  return (
    <Flex
      direction="column"
      gap={4}
      height={previewHeight}
      maxH="72vh"
      background="transparent"
      px={{ base: 3, md: 0 }}
      justifyContent={{ base: "flex-start", md: "center" }}
      overflowY="auto"
      overflowX="hidden"
    >
      {loading ? (
        <Flex flex={isSmallScreen ? "0 0 auto" : 1} minH={isSmallScreen ? "160px" : 0} align="center" justify="center">
          <Loading />
        </Flex>
      ) : (
        <MissionsPanels
          dailyMissions={dailyMissions}
          weeklyMissions={weeklyMissions}
          dailyResetAt={dailyResetAt}
          weeklyResetAt={weeklyResetAt}
          showProgress
          variant="preview"
        />
      )}
    </Flex>
  );
};
