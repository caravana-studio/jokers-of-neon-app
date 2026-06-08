import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { DailyMission } from "../../types/DailyMissions";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { Clock } from "../Clock";
import CustomScrollbar from "../CustomScrollbar/CustomScrollbar";
import {
  DailyMissionEntry,
  WeeklyMissionEntry,
} from "../DailyMissions/MissionEntries";

type MissionsPanelsVariant = "page" | "preview";

interface MissionsPanelsProps {
  dailyMissions: DailyMission[];
  weeklyMissions: DailyMission[];
  dailyResetAt: Date;
  weeklyResetAt: Date;
  showProgress?: boolean;
  variant?: MissionsPanelsVariant;
}

const PAGE_PANEL_STYLES = {
  background: "rgba(0, 0, 0, 0.4)",
  boxShadow:
    "0 0 22px rgba(255,255,255,0.4), inset 0 0 15px rgba(255,255,255,0.1)",
  backdropFilter: "blur(2px)",
};

const PREVIEW_PANEL_STYLES = {
  background: "transparent",
  boxShadow:
    "0 0 22px rgba(255,255,255,0.22), inset 0 0 15px rgba(255,255,255,0.08)",
  backdropFilter: "blur(2px)",
  border: "1px solid rgba(255,255,255,0.12)",
};

interface MissionPanelSectionProps {
  title: string;
  resetAt: Date;
  missions: DailyMission[];
  variant: MissionsPanelsVariant;
  compacted?: boolean;
  isDaily?: boolean;
  showProgress?: boolean;
  xpLabel: string;
  emptyLabel: string;
}

const MissionPanelSection = ({
  title,
  resetAt,
  missions,
  variant,
  compacted = false,
  isDaily = false,
  showProgress = false,
  xpLabel,
  emptyLabel,
}: MissionPanelSectionProps) => {
  const { isSmallScreen } = useResponsiveValues();

  const renderMissionList = (content: React.ReactNode) =>
    variant === "preview" && !isSmallScreen ? (
      <CustomScrollbar>{content}</CustomScrollbar>
    ) : (
      content
    );

  const panelStyles =
    variant === "preview" ? PREVIEW_PANEL_STYLES : PAGE_PANEL_STYLES;

  return (
    <Flex direction="column" minH={0} gap={3}>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        mt={isDaily && variant === "page" ? { base: 2, md: 0 } : 0}
        gap={2}
        px={variant === "page" ? 2 : 0}
      >
        <Heading
          variant="italic"
          fontSize={
            variant === "preview"
              ? { base: "14px", md: "18px" }
              : { base: "15px", sm: "22px" }
          }
          zIndex={variant === "page" ? 10 : undefined}
        >
          {title}
        </Heading>
        <Flex
          w={variant === "page" ? { base: "80px", sm: "120px" } : "auto"}
          justifyContent="flex-end"
        >
          <Clock
            date={resetAt}
            fontSize={
              variant === "preview" ? (isSmallScreen ? 11 : 14) : isSmallScreen ? 12 : 16
            }
            iconSize={
              variant === "preview"
                ? isSmallScreen
                  ? "11px"
                  : "16px"
                : isSmallScreen
                  ? "12px"
                  : "18px"
            }
          />
        </Flex>
      </Flex>

      <Box
        flex={variant === "preview" && !isSmallScreen ? 1 : "0 0 auto"}
        minH={0}
        borderRadius={variant === "preview" ? "24px" : { base: "24px", sm: "30px" }}
        px={variant === "preview" ? { base: 3, md: 4 } : { base: 4, sm: 6 }}
        py={variant === "preview" ? { base: 3, md: 4 } : isDaily ? { base: 4, sm: 5 } : { base: 3, sm: 5 }}
        overflow={variant === "preview" ? "hidden" : "visible"}
        {...panelStyles}
      >
        {missions.length === 0 ? (
          <Text color="gray.400" fontSize={compacted ? { base: "12px", md: "14px" } : { base: "15px", sm: "20px" }}>
            {emptyLabel}
          </Text>
        ) : (
          renderMissionList(
            <Flex
              direction="column"
              gap={compacted ? 3 : { base: 4, sm: 5 }}
              pr={variant === "preview" ? 1 : 0}
            >
              {missions.map((mission) =>
                isDaily ? (
                  <DailyMissionEntry
                    key={`daily-${variant}-${mission.missionId}`}
                    mission={mission}
                    xpLabel={xpLabel}
                    compacted={compacted}
                    completed={mission.completed}
                    showProgress={showProgress}
                  />
                ) : (
                  <WeeklyMissionEntry
                    key={`weekly-${variant}-${mission.missionId}`}
                    mission={mission}
                    xpLabel={xpLabel}
                    compacted={compacted}
                  />
                ),
              )}
            </Flex>,
          )
        )}
      </Box>
    </Flex>
  );
};

export const MissionsPanels = ({
  dailyMissions,
  weeklyMissions,
  dailyResetAt,
  weeklyResetAt,
  showProgress = false,
  variant = "page",
}: MissionsPanelsProps) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "missions",
  });
  const { t: tHome } = useTranslation("home", { keyPrefix: "home" });

  return (
    <Grid
      templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }}
      gap={variant === "preview" ? { base: 3, md: 4 } : { base: 3, md: 6 }}
      alignItems={variant === "preview" ? { base: "start", md: "center" } : "start"}
      w="100%"
      minH={0}
    >
      <MissionPanelSection
        title={t("weekly-short-title")}
        resetAt={weeklyResetAt}
        missions={weeklyMissions}
        variant={variant}
        compacted={variant === "preview"}
        xpLabel={t("xp-label")}
        emptyLabel={tHome("noMissionsAvailable")}
      />

      <MissionPanelSection
        title={t("daily-short-title")}
        resetAt={dailyResetAt}
        missions={dailyMissions}
        variant={variant}
        compacted={variant === "preview"}
        isDaily
        showProgress={showProgress}
        xpLabel={t("xp-label")}
        emptyLabel={tHome("noMissionsAvailable")}
      />
    </Grid>
  );
};
