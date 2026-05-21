import { Box, Flex, Text } from "@chakra-ui/react";
import { ProgressBar } from "../CompactRoundData/ProgressBar";
import { BLUE, VIOLET } from "../../theme/colors";
import { DailyMission } from "../../types/DailyMissions";
import { DailyMissionCheckbox } from "./DailyMissionCheckbox";

const MissionXp = ({
  xp,
  xpLabel,
  completed,
  compacted = false,
  minWidth,
}: {
  xp: number;
  xpLabel: string;
  completed: boolean;
  compacted?: boolean;
  minWidth?: string;
}) => (
  <Flex
    minW={minWidth}
    justifyContent="flex-end"
    alignItems="baseline"
    gap={0.5}
    opacity={completed ? 1 : 0.5}
    flexShrink={0}
  >
    <Text
      fontFamily="Orbitron"
      fontSize={compacted ? { base: "22px", sm: "28px" } : { base: "28px", sm: "46px" }}
      lineHeight={0.9}
      fontWeight={600}
      textShadow={completed ? "0 0 12px rgba(255,255,255,0.75)" : "none"}
    >
      {xp}
    </Text>
    <Text
      fontFamily="Orbitron"
      fontWeight={600}
      fontSize={compacted ? { base: "10px", sm: "14px" } : { base: "12px", sm: "26px" }}
      lineHeight={1}
      textTransform="uppercase"
      textShadow={completed ? "0 0 12px rgba(255,255,255,0.75)" : "none"}
    >
      {xpLabel}
    </Text>
  </Flex>
);

interface MissionEntryProps {
  mission: DailyMission;
  xpLabel: string;
  compacted?: boolean;
}

export const DailyMissionEntry = ({
  mission,
  xpLabel,
  compacted = false,
}: MissionEntryProps) => (
  <Flex justifyContent="space-between" alignItems="center" gap={compacted ? 2 : 3}>
    <Flex alignItems="center" gap={compacted ? 2.5 : { base: 3, sm: 4 }} minW={0}>
      <DailyMissionCheckbox
        completed={mission.completed}
        size={compacted ? { base: "20px", sm: "24px" } : { base: "24px", sm: "30px" }}
        borderRadius={compacted ? { base: "8px", sm: "10px" } : { base: "10px", sm: "13px" }}
      />
      <Text
        fontSize={compacted ? { base: "12px", sm: "14px" } : { base: "15px", sm: "20px" }}
        lineHeight={compacted ? 1.15 : 1.2}
      >
        {mission.description}
      </Text>
    </Flex>
    <MissionXp
      xp={mission.xp}
      xpLabel={xpLabel}
      completed={mission.completed}
      compacted={compacted}
      minWidth={compacted ? "54px" : "70px"}
    />
  </Flex>
);

export const WeeklyMissionEntry = ({
  mission,
  xpLabel,
  compacted = false,
}: MissionEntryProps) => {
  const progress = mission.progress ?? 0;
  const target = mission.target ?? 0;
  const percent = target > 0 ? (progress / target) * 100 : 0;
  const progressLabel = `${progress}/${target}`;
  const completed = mission.completed || (target > 0 && progress >= target);

  if (compacted) {
    return (
      <Flex justifyContent="space-between" alignItems="center" gap={2}>
        <Flex alignItems="center" gap={2.5} minW={0}>
          <DailyMissionCheckbox
            completed={completed}
            size={{ base: "20px", sm: "24px" }}
            borderRadius={{ base: "8px", sm: "10px" }}
          />
          <Text fontSize={{ base: "12px", sm: "14px" }} lineHeight={1.15}>
            {mission.description}
            {!completed ? ` (${progressLabel})` : ""}
          </Text>
        </Flex>
        <MissionXp
          xp={mission.xp}
          xpLabel={xpLabel}
          completed={completed}
          compacted
          minWidth="54px"
        />
      </Flex>
    );
  }

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
