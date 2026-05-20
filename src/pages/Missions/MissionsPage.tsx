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
import { MobileBottomBar } from "../../components/MobileBottomBar";
import { MobileDecoration } from "../../components/MobileDecoration";
import { useInformationPopUp } from "../../providers/InformationPopUpProvider";
import { BLUE, VIOLET } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import {
  getNextDailyMissionResetDate,
  getNextWeeklyMissionResetDate,
} from "../../utils/missionsTimers";
import { DailyMissionCheckbox } from "./DailyMissionCheckbox";

interface WeeklyMission {
  title: string;
  current: number;
  target: number;
  xp: number;
}

interface DailyMission {
  title: string;
  xp: number;
  completed: boolean;
}

const WEEKLY_MISSIONS: WeeklyMission[] = [
  {
    title: "Burn 5 cards",
    current: 4,
    target: 5,
    xp: 40,
  },
  {
    title: "Burn 8 modifiers",
    current: 3,
    target: 8,
    xp: 70,
  },
  {
    title: "Sell 10 power-ups",
    current: 10,
    target: 10,
    xp: 100,
  },
];

const DAILY_MISSIONS: DailyMission[] = [
  {
    title: "Add 5 cards to your deck",
    xp: 10,
    completed: true,
  },
  {
    title: "Reach level 2",
    xp: 20,
    completed: false,
  },
  {
    title: "Add 25 cards to your deck",
    xp: 30,
    completed: true,
  },
];

const MISSION_PANEL_STYLES = {
  background: "rgba(0, 0, 0, 0.4)",
  boxShadow:
    "0 0 22px rgba(255,255,255,0.4), inset 0 0 15px rgba(255,255,255,0.1)",
  backdropFilter: "blur(2px)",
};

const MissionXp = ({
  xp,
  completed,
  minWidth,
}: {
  xp: number;
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
      XP
    </Text>
  </Flex>
);

const WeeklyMissionRow = ({ mission }: { mission: WeeklyMission }) => {
  const percent = (mission.current / mission.target) * 100;
  const progressLabel = `${mission.current}/${mission.target}`;
  const completed = percent >= 100;

  return (
    <Flex direction="column" gap={0.5} py={{ base: 1, sm: 2 }}>
      <Text fontSize={{ base: "15px", sm: "20px" }} lineHeight={1}>
        {mission.title}
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
        <MissionXp xp={mission.xp} completed={completed} minWidth="60px" />
      </Flex>
    </Flex>
  );
};

const DailyMissionRow = ({ mission }: { mission: DailyMission }) => (
  <Flex justifyContent="space-between" alignItems="center" gap={3}>
    <Flex alignItems="center" gap={{ base: 3, sm: 4 }} minW={0}>
      <DailyMissionCheckbox completed={mission.completed} />
      <Text fontSize={{ base: "15px", sm: "20px" }} lineHeight={1.2}>
        {mission.title}
      </Text>
    </Flex>
    <MissionXp xp={mission.xp} completed={mission.completed} minWidth="70px" />
  </Flex>
);

export const MissionsPage = () => {
  const navigate = useNavigate();
  const { isSmallScreen } = useResponsiveValues();
  const { setInformation } = useInformationPopUp();
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "season-progression",
  });
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, []);

  const dailyResetAt = useMemo(() => getNextDailyMissionResetDate(now), [now]);
  const weeklyResetAt = useMemo(
    () => getNextWeeklyMissionResetDate(now),
    [now],
  );

  const infoContent = useMemo(
    () => (
      <VStack align="start" spacing={4}>
        <Heading size="sm" variant="italic">
          {t("intro.popup-title")}
        </Heading>
        <Divider borderColor={BLUE} />
        <VStack align="start" spacing={3}>
          <Text fontSize={{ base: "sm", md: "md" }}>{t("intro.points.1")}</Text>
          <Text fontSize={{ base: "sm", md: "md" }}>{t("intro.points.2")}</Text>
          <Text fontSize={{ base: "sm", md: "md" }}>{t("intro.points.3")}</Text>
          <Text fontSize={{ base: "sm", md: "md" }}>{t("intro.points.4")}</Text>
        </VStack>
      </VStack>
    ),
    [t],
  );

  return (
    <>
      <MobileDecoration fadeToBlack />
      <Flex
        w="100%"
        overflowY="auto"
        overflowX="hidden"
        px={{ base: 4, sm: 7, md: 10 }}
        pt={{ base: "35px", sm: "74px" }}
        position="relative"
      >
        <Flex
          w="100%"
          maxW="760px"
          mx="auto"
          flexDir="column"
          justifyContent="space-between"
          gap={6}
        >
          <Flex flexDir="column" gap={5}>
            <Flex justifyContent="space-between" alignItems="center" gap={4} px={2}>
              <Heading
                variant="italic"
                fontSize={{ base: "15px", sm: "22px" }}
                zIndex={10}
              >
                Weekly Missions
              </Heading>
              <Clock
                date={weeklyResetAt}
                fontSize={isSmallScreen ? 12 : 16}
                iconSize={isSmallScreen ? "12px" : "18px"}
              />
            </Flex>

            <Box
              borderRadius={{ base: "24px", sm: "30px" }}
              px={{ base: 4, sm: 6 }}
              py={{ base: 4, sm: 5 }}
              {...MISSION_PANEL_STYLES}
            >
              <Flex flexDir="column" gap={{ base: 4, sm: 5 }}>
                {WEEKLY_MISSIONS.map((mission) => (
                  <WeeklyMissionRow key={mission.title} mission={mission} />
                ))}
              </Flex>
            </Box>

            <Flex justifyContent="space-between" alignItems="center" mt={4} gap={4} px={2}>
              <Heading variant="italic" fontSize={{ base: "15px", sm: "22px" }}>
                Daily Missions
              </Heading>
              <Clock
                date={dailyResetAt}
                fontSize={isSmallScreen ? 12 : 16}
                iconSize={isSmallScreen ? "12px" : "18px"}
              />
            </Flex>

            <Box
              borderRadius={{ base: "24px", sm: "30px" }}
              px={{ base: 4, sm: 6 }}
              py={{ base: 4, sm: 5 }}
              {...MISSION_PANEL_STYLES}
            >
              <Flex flexDir="column" gap={{ base: 5, sm: 6 }}>
                {DAILY_MISSIONS.map((mission) => (
                  <DailyMissionRow key={mission.title} mission={mission} />
                ))}
              </Flex>
            </Box>

            <Flex
              justifyContent="space-between"
              alignItems="center"
              gap={3}
              flexWrap="wrap"
              mt={4}
              px={2}
            >
              <Text
                fontSize={{ base: "15px", sm: "18px" }}
                textShadow="0 0 8px rgba(255,255,255,0.18)"
              >
                What's XP and what is it for?
              </Text>
              <Button
                variant="outlinePrimaryGlow"
                size="sm"
                onClick={() => setInformation(infoContent)}
              >
                Learn More
              </Button>
            </Flex>
          </Flex>

          <MobileBottomBar
            firstButton={{
              label: "Season",
              onClick: () => navigate("/season"),
              variant: "secondarySolid",
              fontSize: { base: "8px", sm: "10px", md: "15px" },
              px: { base: 2, sm: 3, md: 7 },
              h: { base: "32px", sm: "40px" },
            }}
            secondButton={{
              label: "Go Home",
              onClick: () => navigate("/"),
              variant: "solid",
              fontSize: { base: "8px", sm: "10px", md: "15px" },
              px: { base: 2, sm: 3, md: 7 },
              h: { base: "32px", sm: "40px" },
            }}
          />
        </Flex>
      </Flex>
    </>
  );
};
