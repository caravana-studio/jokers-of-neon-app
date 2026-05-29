import { Box, Flex, Text } from "@chakra-ui/react";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BLUE, BLUE_LIGHT, VIOLET, VIOLET_LIGHT } from "../theme/colors";
import { ProgressBar } from "./CompactRoundData/ProgressBar";

const BASE_MILESTONES = [7, 14, 30, 50] as const;
const MILESTONE_STEP = 25;
const MIN_PROGRESS_VALUE = 12;
const MAX_PROGRESS_VALUE = 35;

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

export const isDailyStreakAtMilestone = (streak: number) => {
  const normalizedStreak = Number.isFinite(streak)
    ? Math.max(0, Math.floor(streak))
    : 0;

  if (normalizedStreak <= 0) {
    return false;
  }

  return buildMilestonesThrough(normalizedStreak).includes(normalizedStreak);
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
  const accentColor = isAchieved ? VIOLET : isFuture ? "grey" : "white";
  const textColor = isFuture
    ? 'grey'
    : isAchieved
      ? VIOLET_LIGHT
      : 'white';
  const innerBackground = "#050505";
  const badgeShadow = isAchieved
    ? `0 0 10px 1px ${VIOLET}`
    : isFuture
      ? "none"
      : `0 0 8px 1px white`;
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
      <Box
        position="absolute"
        inset={0}
        borderRadius="8px"
        bg={innerBackground}
        border={`2px solid ${accentColor}`}
        overflow="hidden"
      >
        <Flex
          width="100%"
          height="100%"
          position="relative"
          overflow="hidden"
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
        </Flex>
      </Box>

      {isAchieved && value > 0 && (
        <Box
          position="absolute"
          top="-2px"
          right="-2px"
          w="15px"
          h="15px"
          borderRadius="full"
          bg={VIOLET_LIGHT}
          color="white"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="9px"
          lineHeight={1}
          zIndex={10}
          boxShadow={`0 0 6px 2px ${VIOLET_LIGHT}`}
        >
          <FontAwesomeIcon icon={faCheck} />
        </Box>
      )}
    </Box>
  );
};

interface DailyStreakMilestoneProgressProps {
  streak: number;
  animationStartDelayMs?: number;
}

export const DailyStreakMilestoneProgress = ({
  streak,
  animationStartDelayMs = 0,
}: DailyStreakMilestoneProgressProps) => {
  const { t } = useTranslation("intermediate-screens");
  const { badges, progressRatio } = getDailyStreakMilestoneWindow(streak);
  const rawProgress = progressRatio * 50;
  const clampedProgress =
    rawProgress === 0
      ? 0
      : Math.min(MAX_PROGRESS_VALUE, Math.max(MIN_PROGRESS_VALUE, rawProgress));
  const [revealedBadges, setRevealedBadges] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const badgeKey = useMemo(
    () => badges.map((badge) => `${badge.value}-${badge.state}`).join("|"),
    [badges],
  );

  useEffect(() => {
    setRevealedBadges(0);
    setAnimatedProgress(0);

    const timeouts = [
      window.setTimeout(() => setRevealedBadges(1), animationStartDelayMs + 220),
      window.setTimeout(() => setAnimatedProgress(clampedProgress), animationStartDelayMs + 360),
      window.setTimeout(() => setRevealedBadges(2), animationStartDelayMs + 520),
      window.setTimeout(() => setRevealedBadges(3), animationStartDelayMs + 680),
    ];

    return () => {
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [animationStartDelayMs, badgeKey, clampedProgress]);

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
            progress={animatedProgress}
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
          {badges.map((badge, index) => (
            <motion.div
              key={`${badge.value}-${badge.state}`}
              initial={{ opacity: 0, y: 8, scale: 0.92 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: index < revealedBadges ? 1 : 0.96,
              }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              style={{ flexShrink: 0 }}
            >
              <CalendarBadge
                value={badge.value}
                state={index < revealedBadges ? badge.state : "future"}
              />
            </motion.div>
          ))}
        </Flex>
      </Box>
    </Box>
  );
};
