import { Box, Flex, Text } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { VIOLET, VIOLET_LIGHT } from "../theme/colors";

const WEEKDAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;

export interface DailyStreakWeekDay {
  label: string;
  isCompleted: boolean;
  isToday: boolean;
  isFuture: boolean;
}

export const getDailyStreakWeekDays = (
  streak: number,
  referenceDate: Date = new Date()
): DailyStreakWeekDay[] => {
  const normalizedStreak = Number.isFinite(streak)
    ? Math.max(0, Math.floor(streak))
    : 0;
  const todayIndex = (referenceDate.getDay() + 6) % 7;
  const completedDays = Math.min(normalizedStreak, todayIndex + 1);
  const completedStartIndex =
    completedDays > 0 ? todayIndex - completedDays + 1 : Number.POSITIVE_INFINITY;

  return WEEKDAY_LABELS.map((label, index) => ({
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
}

export const DailyStreakWeekProgress = ({
  streak,
  referenceDate,
}: DailyStreakWeekProgressProps) => {
  const days = getDailyStreakWeekDays(streak, referenceDate);
  const firstCompletedIndex = days.findIndex((day) => day.isCompleted);
  const lastCompletedIndex = days.findLastIndex((day) => day.isCompleted);
  const hasActiveTrack =
    firstCompletedIndex !== -1 && lastCompletedIndex > firstCompletedIndex;

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
        <Box
          position="absolute"
          top="38px"
          left={`calc(${((firstCompletedIndex + 0.5) / 7) * 100}% )`}
          right={`calc(${100 - ((lastCompletedIndex + 0.5) / 7) * 100}% )`}
          h="4px"
          borderRadius="full"
          bg={VIOLET_LIGHT}
          boxShadow={`0 0 14px ${VIOLET_LIGHT}`}
        />
      )}

      <Flex justify="space-between" align="flex-start" gap={1}>
        {days.map((day) => {
          const inactiveBg = day.isFuture
            ? "rgba(255, 255, 255, 0.03)"
            : "rgba(255, 255, 255, 0.06)";
          const inactiveBorder = day.isToday
            ? `rgba(255, 147, 75, 0.9)`
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
                    day.isCompleted
                      ? day.isToday
                        ? VIOLET_LIGHT
                        : VIOLET
                      : inactiveBg
                  }
                  border={
                    day.isCompleted
                      ? "1px solid rgba(255, 255, 255, 0.3)"
                      : `1px solid ${inactiveBorder}`
                  }
                  boxShadow={
                    day.isCompleted
                      ? day.isToday
                        ? `0 0 18px ${VIOLET_LIGHT}`
                        : `0 0 18px ${VIOLET}`
                      : day.isToday
                        ? `0 0 14px ${VIOLET_LIGHT}`
                      : "none"
                  }
                  opacity={day.isFuture ? 0.7 : 1}
                >
                  {day.isCompleted && (
                    <Box color="white" fontSize="11px" lineHeight={1}>
                      <FontAwesomeIcon icon={faCheck} />
                    </Box>
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
