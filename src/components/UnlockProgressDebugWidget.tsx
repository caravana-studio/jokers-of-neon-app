import { Box, Button, Collapse, Flex, Spinner, Text } from "@chakra-ui/react";
import { useState } from "react";
import { TESTERS } from "../constants/testers";
import { useUsername } from "../dojo/utils/useUsername";
import { useUnlockProgressStore } from "../state/useUnlockProgressStore";

const PANEL_Z_INDEX = 9999;

export const UnlockProgressDebugWidget = () => {
  const username = useUsername();
  const [isOpen, setIsOpen] = useState(false);
  const playerTier = useUnlockProgressStore((state) => state.playerTier);
  const totalRuns = useUnlockProgressStore((state) => state.totalRuns);
  const maxLevel = useUnlockProgressStore((state) => state.maxLevel);
  const maxRound = useUnlockProgressStore((state) => state.maxRound);
  const unlockEntries = useUnlockProgressStore((state) => state.unlockEntries);
  const isLoading = useUnlockProgressStore((state) => state.loading);
  const error = useUnlockProgressStore((state) => state.error);

  const formatLevelRound = (
    level?: number,
    round?: number,
    fallback = "-"
  ): string => {
    if (level === undefined && round === undefined) return fallback;
    const safeLevel = level ?? 0;
    const safeRound = round ?? 0;
    return `L${safeLevel}R${safeRound}`;
  };

  const meetsRunsRequirement = (
    playerRuns?: number,
    requiredRuns?: number
  ): boolean => {
    if (requiredRuns === undefined || requiredRuns <= 0) return true;
    return (playerRuns ?? 0) >= requiredRuns;
  };

  const meetsRoundRequirement = (
    playerLevel?: number,
    playerRound?: number,
    requiredLevel?: number,
    requiredRound?: number
  ): boolean => {
    if (requiredLevel === undefined && requiredRound === undefined) return true;

    const pLevel = playerLevel ?? 0;
    const pRound = playerRound ?? 0;
    const rLevel = requiredLevel ?? 0;
    const rRound = requiredRound ?? 0;

    if (pLevel > rLevel) return true;
    if (pLevel < rLevel) return false;
    return pRound >= rRound;
  };

  const getRequirementColor = (
    met: boolean,
    hasRequirement: boolean
  ): string => {
    if (!hasRequirement) return "whiteAlpha.500";
    return met ? "green.300" : "whiteAlpha.700";
  };

  const isTester = Boolean(username && TESTERS.includes(username));

  if (!isTester) {
    return null;
  }

  return (
    <Box
      position="absolute"
      top={{ base: "calc(env(safe-area-inset-top) + 12px)", md: 3 }}
      right={{ base: 2, md: 3 }}
      zIndex={PANEL_Z_INDEX}
    >
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        UNLOCK DEBUG
      </Button>

      <Collapse in={isOpen} animateOpacity>
        <Box
          mt={2}
          width={{ base: "calc(100vw - 16px)", md: "360px" }}
          maxHeight={{ base: "58vh", md: "70vh" }}
          overflowY="auto"
          border="1px solid"
          borderColor="whiteAlpha.400"
          borderRadius="10px"
          bg="blackAlpha.800"
          p={3}
          backdropFilter="blur(6px)"
        >
          <Flex justifyContent="space-between" alignItems="center" mb={2}>
            <Text fontSize="xs" color="whiteAlpha.900" fontWeight="bold">
              player tier: {playerTier}
            </Text>
            {isLoading && <Spinner size="xs" />}
          </Flex>

          <Text fontSize="xs" color="whiteAlpha.800" mb={2}>
            runs: {totalRuns ?? 0} · max round:{" "}
            {formatLevelRound(maxLevel, maxRound)}
          </Text>

          {error && (
            <Text fontSize="xs" color="red.200" mb={2}>
              {error}
            </Text>
          )}

          <Flex direction="column" gap={1}>
            {unlockEntries.map((entry) => {
              const isUnlocked = entry.order <= playerTier;
              const hasRunsRequirement =
                entry.runs !== undefined && entry.runs > 0;
              const hasRoundRequirement =
                entry.maxLevel !== undefined || entry.maxRound !== undefined;
              const runsMet = meetsRunsRequirement(totalRuns, entry.runs);
              const roundMet = meetsRoundRequirement(
                maxLevel,
                maxRound,
                entry.maxLevel,
                entry.maxRound
              );
              const requirementsMet = runsMet && roundMet;
              return (
                <Flex
                  key={`${entry.order}-${entry.unlockId}`}
                  justifyContent="space-between"
                  alignItems="flex-start"
                  direction="column"
                  px={2}
                  py={1}
                  borderRadius="6px"
                  bg={isUnlocked ? "green.900" : "whiteAlpha.100"}
                >
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                  >
                    <Text fontSize="xs" color="whiteAlpha.900" pr={2}>
                      #{entry.order} {entry.unlockId}
                    </Text>
                    <Text
                      fontSize="xs"
                      color={isUnlocked ? "green.200" : "whiteAlpha.700"}
                      whiteSpace="nowrap"
                    >
                      {isUnlocked ? "unlocked" : "locked"}
                    </Text>
                  </Flex>
                  <Flex mt={0.5} alignItems="center" gap={1} flexWrap="wrap">
                    <Text fontSize="11px" color="whiteAlpha.700">
                      runs
                    </Text>
                    <Text
                      fontSize="11px"
                      color={getRequirementColor(runsMet, hasRunsRequirement)}
                      fontWeight={runsMet && hasRunsRequirement ? "700" : "400"}
                    >
                      {entry.runs ?? "-"}
                    </Text>
                    <Text fontSize="11px" color="whiteAlpha.500">
                      ·
                    </Text>
                    <Text fontSize="11px" color="whiteAlpha.700">
                      round
                    </Text>
                    <Text
                      fontSize="11px"
                      color={getRequirementColor(roundMet, hasRoundRequirement)}
                      fontWeight={roundMet && hasRoundRequirement ? "700" : "400"}
                    >
                      {formatLevelRound(entry.maxLevel, entry.maxRound)}
                    </Text>
                  </Flex>
                </Flex>
              );
            })}
          </Flex>
        </Box>
      </Collapse>
    </Box>
  );
};
