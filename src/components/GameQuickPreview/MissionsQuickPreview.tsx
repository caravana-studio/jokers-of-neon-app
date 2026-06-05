import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useMissionsData } from "../../hooks/useMissionsData";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import {
  getNextDailyMissionResetDate,
  getNextWeeklyMissionResetDate,
} from "../../utils/missionsTimers";
import { Clock } from "../Clock";
import CustomScrollbar from "../CustomScrollbar/CustomScrollbar";
import {
  DailyMissionEntry,
  WeeklyMissionEntry,
} from "../DailyMissions/MissionEntries";
import { Loading } from "../Loading";

const MISSION_PANEL_STYLES = {
  background: "transparent",
  boxShadow:
    "0 0 22px rgba(255,255,255,0.22), inset 0 0 15px rgba(255,255,255,0.08)",
  backdropFilter: "blur(2px)",
  border: "1px solid rgba(255,255,255,0.12)",
};

export const MissionsQuickPreview = () => {
  const { isSmallScreen } = useResponsiveValues();
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "missions",
  });
  const { t: tHome } = useTranslation("home", { keyPrefix: "home" });
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

  const renderMissionList = (content: React.ReactNode) =>
    isSmallScreen ? content : <CustomScrollbar>{content}</CustomScrollbar>;

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
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }}
          gap={{ base: 3, md: 4 }}
          flex="0 0 auto"
          minH={0}
          alignItems={{ base: "start", md: "center" }}
        >
          <Flex direction="column" minH={0} gap={3}>
            <Flex justifyContent="space-between" alignItems="center" gap={2}>
              <Heading variant="italic" fontSize={{ base: "14px", md: "18px" }}>
                {t("weekly-short-title")}
              </Heading>
              <Clock
                date={weeklyResetAt}
                fontSize={isSmallScreen ? 11 : 14}
                iconSize={isSmallScreen ? "11px" : "16px"}
              />
            </Flex>
            <Box
              flex={isSmallScreen ? "0 0 auto" : 1}
              minH={0}
              borderRadius="24px"
              px={{ base: 3, md: 4 }}
              py={{ base: 3, md: 4 }}
              overflow="hidden"
              {...MISSION_PANEL_STYLES}
            >
              {weeklyMissions.length === 0 ? (
                <Text color="gray.400" fontSize={{ base: "12px", md: "14px" }}>
                  {tHome("noMissionsAvailable")}
                </Text>
              ) : (
                renderMissionList(
                  <Flex direction="column" gap={3} pr={1}>
                    {weeklyMissions.map((mission) => (
                      <WeeklyMissionEntry
                        key={`weekly-preview-${mission.missionId}`}
                        mission={mission}
                        xpLabel={t("xp-label")}
                        compacted
                      />
                    ))}
                  </Flex>,
                )
              )}
            </Box>
          </Flex>

          <Flex direction="column" minH={0} gap={3}>
            <Flex justifyContent="space-between" alignItems="center" gap={2}>
              <Heading variant="italic" fontSize={{ base: "14px", md: "18px" }}>
                {t("daily-short-title")}
              </Heading>
              <Clock
                date={dailyResetAt}
                fontSize={isSmallScreen ? 11 : 14}
                iconSize={isSmallScreen ? "11px" : "16px"}
              />
            </Flex>
            <Box
              flex={isSmallScreen ? "0 0 auto" : 1}
              minH={0}
              borderRadius="24px"
              px={{ base: 3, md: 4 }}
              py={{ base: 3, md: 4 }}
              overflow="hidden"
              {...MISSION_PANEL_STYLES}
            >
              {dailyMissions.length === 0 ? (
                <Text color="gray.400" fontSize={{ base: "12px", md: "14px" }}>
                  {tHome("noMissionsAvailable")}
                </Text>
              ) : (
                renderMissionList(
                  <Flex direction="column" gap={3} pr={1}>
                    {dailyMissions.map((mission) => (
                      <DailyMissionEntry
                        key={`daily-preview-${mission.missionId}`}
                        mission={mission}
                        xpLabel={t("xp-label")}
                        compacted
                        completed={mission.completed}
                        showProgress
                      />
                    ))}
                  </Flex>,
                )
              )}
            </Box>
          </Flex>
        </Grid>
      )}
    </Flex>
  );
};
