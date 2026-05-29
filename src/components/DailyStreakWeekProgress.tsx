import { Box, Flex, Text } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { VIOLET, VIOLET_LIGHT } from "../theme/colors";

const WEEKDAY_KEYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export interface DailyStreakWeekDay {
  label: string;
  isCompleted: boolean;
  isToday: boolean;
  isFuture: boolean;
}

export const getDailyStreakWeekDays = (
  streak: number,
  labels: readonly string[],
  referenceDate: Date = new Date()
): DailyStreakWeekDay[] => {
  const normalizedStreak = Number.isFinite(streak)
    ? Math.max(0, Math.floor(streak))
    : 0;
  const todayIndex = (referenceDate.getDay() + 6) % 7;
  const completedDays = Math.min(normalizedStreak, todayIndex + 1);
  const completedStartIndex =
    completedDays > 0 ? todayIndex - completedDays + 1 : Number.POSITIVE_INFINITY;

  return labels.map((label, index) => ({
    label,
    isCompleted:
      index <= todayIndex &&
      index >= completedStartIndex &&
      completedDays > 0,
    isToday: index === todayIndex,
    isFuture: index > todayIndex,
  }));
};

interface DailyStreakWeekProgressProps {
  streak: number;
  referenceDate?: Date;
  animationStartDelayMs?: number;
}

export const DailyStreakWeekProgress = ({
  streak,
  referenceDate,
  animationStartDelayMs = 0,
}: DailyStreakWeekProgressProps) => {
  const { t } = useTranslation("intermediate-screens");
  const weekdayLabels = WEEKDAY_KEYS.map((dayKey) =>
    t(`daily-streak.days.${dayKey}`)
  );
  const days = getDailyStreakWeekDays(streak, weekdayLabels, referenceDate);
  const firstCompletedIndex = days.findIndex((day) => day.isCompleted);
  const lastCompletedIndex = days.findLastIndex((day) => day.isCompleted);
  const totalCompletedDays = days.filter((day) => day.isCompleted).length;
  const [animatedCompletedCount, setAnimatedCompletedCount] = useState(0);

  useEffect(() => {
    setAnimatedCompletedCount(0);

    if (totalCompletedDays === 0) {
      return;
    }

    const timeouts = Array.from({ length: totalCompletedDays }, (_, index) =>
      window.setTimeout(() => {
        setAnimatedCompletedCount(index + 1);
      }, animationStartDelayMs + 260 + index * 170)
    );

    return () => {
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [animationStartDelayMs, totalCompletedDays, streak]);

  const animatedLastCompletedIndex =
    animatedCompletedCount > 0 && firstCompletedIndex !== -1
      ? firstCompletedIndex + animatedCompletedCount - 1
      : -1;
  const hasActiveTrack =
    firstCompletedIndex !== -1 && animatedCompletedCount > 1;
  const activeTrackLeft = `${((firstCompletedIndex + 0.5) / 7) * 100}%`;
  const activeTrackWidth = `${(Math.max(animatedCompletedCount - 1, 0) / 7) * 100}%`;

  return (
    <Box position="relative" w="100%" maxW="340px" mx="auto" px={1}>
      <Box
        position="absolute"
        top="38px"
        left="calc(100% / 14)"
        right="calc(100% / 14)"
        h="4px"
        borderRadius="full"
        bg="rgba(255, 255, 255, 0.12)"
      />

      {hasActiveTrack && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: activeTrackWidth }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: "38px",
            left: activeTrackLeft,
            height: "4px",
            borderRadius: "9999px",
            background: VIOLET_LIGHT,
            boxShadow: `0 0 14px ${VIOLET_LIGHT}`,
          }}
        />
      )}

      <Flex justify="space-between" align="flex-start" gap={1}>
        {days.map((day, index) => {
          const isAnimatedCompleted =
            day.isCompleted &&
            firstCompletedIndex !== -1 &&
            index >= firstCompletedIndex &&
            index <= animatedLastCompletedIndex;
          const inactiveBg = day.isFuture
            ? "rgba(255, 255, 255, 0.03)"
            : "rgba(255, 255, 255, 0.06)";
          const inactiveBorder = day.isToday
            ? VIOLET_LIGHT
            : "rgba(255, 255, 255, 0.14)";

          return (
            <Flex
              key={day.label}
              position="relative"
              zIndex={1}
              flex="1"
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <Text
                fontSize="12px"
                fontWeight={day.isToday ? 700 : 500}
                color={day.isToday ? VIOLET_LIGHT : "rgba(255, 255, 255, 0.82)"}
              >
                {day.label}
              </Text>

              <Box position="relative">
                <Flex
                  w="28px"
                  h="28px"
                  borderRadius="full"
                  alignItems="center"
                  justifyContent="center"
                  bg={
                    isAnimatedCompleted
                      ? day.isToday
                        ? VIOLET_LIGHT
                        : VIOLET
                      : inactiveBg
                  }
                  border={
                    isAnimatedCompleted
                      ? "1px solid rgba(255, 255, 255, 0.3)"
                      : `1px solid ${inactiveBorder}`
                  }
                  boxShadow={
                    isAnimatedCompleted
                      ? day.isToday
                        ? `0 0 18px ${VIOLET_LIGHT}`
                        : `0 0 18px ${VIOLET}`
                      : day.isToday
                        ? `0 0 14px ${VIOLET_LIGHT}`
                      : "none"
                  }
                  opacity={day.isFuture ? 0.7 : 1}
                >
                  {isAnimatedCompleted && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                      style={{
                        color: "white",
                        fontSize: "11px",
                        lineHeight: 1,
                      }}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </motion.div>
                  )}
                </Flex>
              </Box>
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
};
