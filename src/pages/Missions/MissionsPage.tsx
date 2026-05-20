import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Clock } from "../../components/Clock";
import { ProgressBar } from "../../components/CompactRoundData/ProgressBar";
import { DelayedLoading } from "../../components/DelayedLoading";
import { MobileBottomBar } from "../../components/MobileBottomBar";
import { MobileDecoration } from "../../components/MobileDecoration";
import {
  getDailyMissions,
  getWeeklyMissions,
} from "../../dojo/queries/getDailyMissions";
import { useDojo } from "../../dojo/useDojo";
import { useInformationPopUp } from "../../providers/InformationPopUpProvider";
import { BLUE, VIOLET } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { DailyMission } from "../../types/DailyMissions";
import {
  getNextDailyMissionResetDate,
  getNextWeeklyMissionResetDate,
} from "../../utils/missionsTimers";
import { DailyMissionCheckbox } from "./DailyMissionCheckbox";

const MISSION_PANEL_STYLES = {
  background: "rgba(0, 0, 0, 0.4)",
  boxShadow:
    "0 0 22px rgba(255,255,255,0.4), inset 0 0 15px rgba(255,255,255,0.1)",
  backdropFilter: "blur(2px)",
};

const MissionXp = ({
  xp,
  xpLabel,
  completed,
  minWidth,
}: {
  xp: number;
  xpLabel: string;
  completed: boolean;
  minWidth?: string;
}) => (
  <Flex
    minW={minWidth}
    justifyContent="flex-end"
    alignItems="baseline"
    gap={0.5}
    opacity={completed ? 1 : 0.5}
  >
    <Text
      fontFamily="Orbitron"
      fontSize={{ base: "28px", sm: "46px" }}
      lineHeight={0.9}
      fontWeight={600}
      textShadow={completed ? "0 0 12px rgba(255,255,255,0.75)" : "none"}
    >
      {xp}
    </Text>
    <Text
      fontFamily="Orbitron"
      fontWeight={600}
      fontSize={{ base: "12px", sm: "26px" }}
      lineHeight={1}
      textTransform="uppercase"
      textShadow={completed ? "0 0 12px rgba(255,255,255,0.75)" : "none"}
    >
      {xpLabel}
    </Text>
  </Flex>
);

const WeeklyMissionRow = ({
  mission,
  xpLabel,
}: {
  mission: DailyMission;
  xpLabel: string;
}) => {
  const progress = mission.progress ?? 0;
  const target = mission.target ?? 0;
  const percent = target > 0 ? (progress / target) * 100 : 0;
  const progressLabel = `${progress}/${target}`;
  const completed = mission.completed || (target > 0 && progress >= target);

  return (
    <Flex direction="column" gap={0.5} py={{ base: 1, sm: 2 }}>
      <Text fontSize={{ base: "15px", sm: "20px" }} lineHeight={1}>
        {mission.description}
      </Text>
      <Flex alignItems="center" gap={{ base: 3, sm: 5 }}>
        <Box flex={1}>
          <ProgressBar
            progress={percent}
            incompleteColor={BLUE}
            completeColor={VIOLET}
            height={{ base: "18px", sm: "22px" }}
            label={progressLabel}
            labelFontSize={{ base: "12px", sm: "15px" }}
          />
        </Box>
        <MissionXp
          xp={mission.xp}
          xpLabel={xpLabel}
          completed={completed}
          minWidth="60px"
        />
      </Flex>
    </Flex>
  );
};

const DailyMissionRow = ({
  mission,
  xpLabel,
}: {
  mission: DailyMission;
  xpLabel: string;
}) => (
  <Flex justifyContent="space-between" alignItems="center" gap={3}>
    <Flex alignItems="center" gap={{ base: 3, sm: 4 }} minW={0}>
      <DailyMissionCheckbox completed={mission.completed} />
      <Text fontSize={{ base: "15px", sm: "20px" }} lineHeight={1.2}>
        {mission.description}
      </Text>
    </Flex>
    <MissionXp
      xp={mission.xp}
      xpLabel={xpLabel}
      completed={mission.completed}
      minWidth="70px"
    />
  </Flex>
);

export const MissionsPage = () => {
  const navigate = useNavigate();
  const { isSmallScreen } = useResponsiveValues();
  const { setInformation } = useInformationPopUp();
  const {
    setup: { client },
    account: { account },
  } = useDojo();
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "missions",
  });
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>([]);
  const [weeklyMissions, setWeeklyMissions] = useState<DailyMission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!account) {
      setDailyMissions([]);
      setWeeklyMissions([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    Promise.all([
      getDailyMissions(client, account.address),
      getWeeklyMissions(client, account.address),
    ])
      .then(([daily, weekly]) => {
        if (cancelled) {
          return;
        }

        setDailyMissions([...daily].sort((a, b) => a.xp - b.xp));
        setWeeklyMissions([...weekly].sort((a, b) => a.xp - b.xp));
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [account, client]);

  const dailyResetAt = getNextDailyMissionResetDate(new Date());
  const weeklyResetAt = getNextWeeklyMissionResetDate(new Date());

  const infoContent = useMemo(
    () => (
      <VStack align="start" spacing={4}>
        <Heading size="sm" variant="italic">
          {t("learn-more.popup-title")}
        </Heading>
        <Divider borderColor={BLUE} />
        <VStack align="start" spacing={3}>
          <Text fontSize={{ base: "sm", md: "md" }}>
            {t("learn-more.points.1")}
          </Text>
          <Text fontSize={{ base: "sm", md: "md" }}>
            {t("learn-more.points.2")}
          </Text>
          <Text fontSize={{ base: "sm", md: "md" }}>
            {t("learn-more.points.3")}
          </Text>
          <Text fontSize={{ base: "sm", md: "md" }}>
            {t("learn-more.points.4")}
          </Text>
        </VStack>
      </VStack>
    ),
    [t]
  );

  return (
    <DelayedLoading ms={100} loading={loading}>
      <MobileDecoration />
      <Flex
        w="100%"
        overflowY="auto"
        overflowX="hidden"
        px={{ base: 4, sm: 7, md: 10 }}
        pt={{ base: "27px", sm: "74px" }}
        position="relative"
        flexGrow={1}
        minH={0}
      >
        <Flex
          w="100%"
          maxW="760px"
          mx="auto"
          flexDir="column"
          justifyContent="space-between"
        >
          <Flex flexDir="column" gap={3}>
            <Heading
              variant="italic"
              fontSize={{ base: "20px", sm: "30px" }}
              px={2}
              zIndex={10}
            >
              {t("title")}
            </Heading>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              gap={2}
              px={2}
            >
              <Heading
                variant="italic"
                fontSize={{ base: "15px", sm: "22px" }}
                zIndex={10}
              >
                {t("weekly-short-title")}
              </Heading>
              <Flex w={{ base: "80px", sm: "120px" }} justifyContent="flex-end">
                <Clock
                  date={weeklyResetAt}
                  fontSize={isSmallScreen ? 12 : 16}
                  iconSize={isSmallScreen ? "12px" : "18px"}
                />
              </Flex>
            </Flex>

            <Box
              borderRadius={{ base: "24px", sm: "30px" }}
              px={{ base: 4, sm: 6 }}
              py={{ base: 3, sm: 5 }}
              {...MISSION_PANEL_STYLES}
            >
              <Flex flexDir="column" gap={{ base: 4, sm: 5 }}>
                {weeklyMissions.map((mission) => (
                  <WeeklyMissionRow
                    key={`weekly-${mission.missionId}`}
                    mission={mission}
                    xpLabel={t("xp-label")}
                  />
                ))}
              </Flex>
            </Box>

            <Flex
              justifyContent="space-between"
              alignItems="center"
              mt={2}
              gap={2}
              px={2}
            >
              <Heading variant="italic" fontSize={{ base: "15px", sm: "22px" }}>
                {t("daily-short-title")}
              </Heading>
              <Flex w={{ base: "80px", sm: "120px" }} justifyContent="flex-end">
                <Clock
                  date={dailyResetAt}
                  fontSize={isSmallScreen ? 12 : 16}
                  iconSize={isSmallScreen ? "12px" : "18px"}
                />
              </Flex>
            </Flex>

            <Box
              borderRadius={{ base: "24px", sm: "30px" }}
              px={{ base: 4, sm: 6 }}
              py={{ base: 4, sm: 5 }}
              {...MISSION_PANEL_STYLES}
            >
              <Flex flexDir="column" gap={{ base: 5, sm: 6 }}>
                {dailyMissions.map((mission) => (
                  <DailyMissionRow
                    key={`daily-${mission.missionId}`}
                    mission={mission}
                    xpLabel={t("xp-label")}
                  />
                ))}
              </Flex>
            </Box>

            <Flex
              justifyContent="space-between"
              alignItems="center"
              gap={3}
              mt={1}
              px={2}
            >
              <Flex>
                <Text
                  fontSize={{ base: "15px", sm: "18px" }}
                  textShadow="0 0 8px rgba(255,255,255,0.18)"
                >
                  {t("learn-more.question")}
                </Text>
              </Flex>
              <Flex>
                <Button
                  variant="outlinePrimaryGlow"
                  size="sm"
                  onClick={() => setInformation(infoContent)}
                >
                  {t("learn-more.cta")}
                </Button>
              </Flex>
            </Flex>
          </Flex>

          <MobileBottomBar
            firstButton={{
              label: t("bottom-bar.season-progression"),
              onClick: () => navigate("/season"),
              variant: "secondarySolid",
              fontSize: { base: "8px", sm: "10px", md: "15px" },
              px: { base: 2, sm: 3, md: 7 },
              h: { base: "32px", sm: "40px" },
            }}
            secondButton={{
              label: t("bottom-bar.go-home"),
              onClick: () => navigate("/"),
              variant: "solid",
              fontSize: { base: "8px", sm: "10px", md: "15px" },
              px: { base: 2, sm: 3, md: 7 },
              h: { base: "32px", sm: "40px" },
            }}
          />
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};
