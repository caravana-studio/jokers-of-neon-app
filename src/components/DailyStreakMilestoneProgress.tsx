import { Box, Flex, Text } from "@chakra-ui/react";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import {
  BLUE_LIGHT,
  GREY_LINE,
  VIOLET,
  VIOLET_LIGHT
} from "../theme/colors";
import { ProgressBar } from "./CompactRoundData/ProgressBar";

const BASE_MILESTONES = [7, 14, 30, 50] as const;
const MILESTONE_STEP = 25;

type MilestoneState = "achieved" | "active" | "future";

interface MilestoneBadgeData {
  value: number;
  state: MilestoneState;
}

interface MilestoneWindow {
  badges: MilestoneBadgeData[];
  progressRatio: number;
}

const buildMilestonesThrough = (minimumValue: number) => {
  const milestones: number[] = [...BASE_MILESTONES];
  let nextMilestone = 75;

  while (milestones[milestones.length - 1] < minimumValue) {
    milestones.push(nextMilestone);
    nextMilestone += MILESTONE_STEP;
  }

  return milestones;
};

export const getDailyStreakMilestoneWindow = (
  streak: number,
): MilestoneWindow => {
  const normalizedStreak = Number.isFinite(streak)
    ? Math.max(0, Math.floor(streak))
    : 0;
  const milestones = buildMilestonesThrough(normalizedStreak + 50);
  const currentIndex = milestones.findIndex(
    (milestone) => milestone > normalizedStreak,
  );

  if (currentIndex <= 0) {
    const previousTarget = 0;
    const currentTarget = milestones[0];
    const nextTarget = milestones[1];

    return {
      badges: [
        { value: previousTarget, state: "achieved" },
        { value: currentTarget, state: "active" },
        { value: nextTarget, state: "future" },
      ],
      progressRatio: Math.min(1, normalizedStreak / currentTarget),
    };
  }

  const previousTarget = milestones[currentIndex - 1];
  const currentTarget = milestones[currentIndex];
  const nextTarget =
    milestones[currentIndex + 1] ?? currentTarget + MILESTONE_STEP;
  const progressWithinTarget =
    (normalizedStreak - previousTarget) / (currentTarget - previousTarget);

  return {
    badges: [
      { value: previousTarget, state: "achieved" },
      { value: currentTarget, state: "active" },
      { value: nextTarget, state: "future" },
    ],
    progressRatio: Math.max(0, Math.min(1, progressWithinTarget)),
  };
};

const CalendarBadge = ({ value, state }: MilestoneBadgeData) => {
  const isAchieved = state === "achieved";
  const isFuture = state === "future";
  const accentColor = isAchieved
    ? VIOLET_LIGHT
    : isFuture
      ? GREY_LINE
      : BLUE_LIGHT;
  const textColor = isFuture ? "rgba(255, 255, 255, 0.5)" : accentColor;
  const innerBackground = "#050505";
  const badgeShadow = isAchieved
    ? "0 0 18px rgba(220, 162, 234, 0.16)"
    : isFuture
      ? "none"
      : "0 0 20px rgba(32, 198, 237, 0.18)";
  const fontSize =
    value >= 100 ? { base: "17px", sm: "19px" } : { base: "20px", sm: "22px" };

  return (
    <Box
      position="relative"
      flexShrink={0}
      width={{ base: "50px", sm: "58px" }}
      height={{ base: "40px", sm: "50px" }}
      borderRadius="16px"
      boxShadow={badgeShadow}
    >
      <Flex
        width="100%"
        height="100%"
        borderRadius="16px"
        bg={innerBackground}
        border={`1px solid ${accentColor}`}
        overflow="hidden"
        position="relative"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          h="7px"
          bg={accentColor}
        />
        <Text
          mt="5px"
          fontFamily="Orbitron"
          fontWeight={800}
          fontSize={fontSize}
          lineHeight={1}
          color={textColor}
          textAlign="center"
          whiteSpace="nowrap"
        >
          {value}
        </Text>
        {isAchieved && value > 0 && (
          <Box
            position="absolute"
            top="0px"
            right="1px"
            w="15px"
            h="15px"
            borderRadius="full"
            bg={VIOLET}
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="9px"
            lineHeight={1}
            boxShadow={`0 0 10px ${VIOLET}`}
            zIndex={10}
          >
            <FontAwesomeIcon icon={faCheck} />
          </Box>
        )}
      </Flex>
    </Box>
  );
};

interface DailyStreakMilestoneProgressProps {
  streak: number;
}

export const DailyStreakMilestoneProgress = ({
  streak,
}: DailyStreakMilestoneProgressProps) => {
  const { t } = useTranslation("intermediate-screens");
  const { badges, progressRatio } = getDailyStreakMilestoneWindow(streak);

  return (
    <Box
      w="100%"
      bg="rgba(0, 0, 0, 0.3)"
      boxShadow="0px 0px 8px rgba(255, 255, 255, 0.5), inset 0 0 5px rgba(255, 255, 255, 0.5)"
      borderRadius="28px"
      px={{ base: 4, sm: 5 }}
      py={3}
    >
      <Text
        mt={1}
        mb={2}
        px={1}
        fontSize={{ base: "10px", sm: "14px" }}
        fontFamily="Sonara"
        textTransform="uppercase"
      >
        {t("daily-streak.next-objective")}
      </Text>

      <Box position="relative" w="100%">
        <Box
          position="absolute"
          top="50%"
          left={{ base: "29px", sm: "34px" }}
          right={{ base: "29px", sm: "34px" }}
          transform="translateY(-50%)"
          zIndex={0}
        >
          <ProgressBar
            progress={progressRatio * 50}
            color={VIOLET}
            incompleteColor="#42515C"
            height="16px"
            borderWidth="2px"
            mt={0}
            animated={false}
          />
        </Box>

        <Flex
          justify="space-between"
          align="center"
          gap={3}
          position="relative"
          zIndex={1}
        >
          {badges.map((badge) => (
            <CalendarBadge
              key={`${badge.value}-${badge.state}`}
              value={badge.value}
              state={badge.state}
            />
          ))}
        </Flex>
      </Box>
    </Box>
  );
};
