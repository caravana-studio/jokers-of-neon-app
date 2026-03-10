import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ROGUELIKE_DEBUG_OVERLAY_HIDDEN } from "../constants/localStorage";
import { isMockGameApiMode } from "../config/gameMode";
import { getNextUnlockRule, UNLOCK_PROGRESS_PATH } from "../domain/roguelike/progression";
import { UnlockRule } from "../domain/roguelike/types";
import { useProgressStore } from "../state/roguelike/useProgressStore";
import { useRunStore } from "../state/roguelike/useRunStore";

const getRuleStatus = (
  rule: UnlockRule,
  unlockedSystems: Set<string>,
  totalRuns: number,
  highestRoundEver: number
): { label: string; color: string; missingText: string | null } => {
  if (unlockedSystems.has(rule.system)) {
    return { label: "UNLOCKED", color: "#31d0aa", missingText: null };
  }

  const missingRuns = Math.max(0, rule.condition.minRun - totalRuns);
  const missingRounds = Math.max(0, rule.condition.minRound - highestRoundEver);

  if (missingRuns === 0 && missingRounds === 0) {
    return { label: "READY", color: "#ffe07a", missingText: "Cumplidas, falta cerrar run" };
  }

  return {
    label: "LOCKED",
    color: "#ff7a8a",
    missingText: `Faltan run:${missingRuns} / round:${missingRounds}`,
  };
};

const readHiddenPreference = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(ROGUELIKE_DEBUG_OVERLAY_HIDDEN) === "1";
};

const writeHiddenPreference = (hidden: boolean): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ROGUELIKE_DEBUG_OVERLAY_HIDDEN, hidden ? "1" : "0");
};

export const RoguelikeProgressDebugOverlay = () => {
  const [hidden, setHidden] = useState<boolean>(readHiddenPreference);
  const bootstrapProgress = useProgressStore((state) => state.bootstrap);
  const progressInitialized = useProgressStore((state) => state.initialized);
  const profile = useProgressStore((state) => state.profile);

  const bootstrapRun = useRunStore((state) => state.bootstrapRun);
  const activeRun = useRunStore((state) => state.activeRun);

  useEffect(() => {
    if (!isMockGameApiMode) {
      return;
    }

    if (!progressInitialized) {
      void bootstrapProgress();
    }
    void bootstrapRun();
  }, [bootstrapProgress, bootstrapRun, progressInitialized]);

  if (!isMockGameApiMode || !profile) {
    return null;
  }

  const toggleHidden = () => {
    setHidden((previous) => {
      const next = !previous;
      writeHiddenPreference(next);
      return next;
    });
  };

  if (hidden) {
    return (
      <Box position="fixed" top="10px" right="10px" zIndex={9999}>
        <Button size="xs" onClick={toggleHidden}>
          Show debug
        </Button>
      </Box>
    );
  }

  const unlockedSystems = new Set(profile.unlockedSystems);
  const totalRuns = profile.totalRuns;
  const highestRoundEver = profile.highestRoundEver;
  const nextRule = getNextUnlockRule(profile.unlockedSystems);

  const unlockedRules = UNLOCK_PROGRESS_PATH.filter((rule) =>
    unlockedSystems.has(rule.system)
  );
  const lockedRules = UNLOCK_PROGRESS_PATH.filter(
    (rule) => !unlockedSystems.has(rule.system)
  );

  return (
    <Box
      position="fixed"
      top="10px"
      right="10px"
      zIndex={9999}
      width={{ base: "92vw", md: "420px" }}
      maxH="78vh"
      overflowY="auto"
      bg="rgba(0, 0, 0, 0.85)"
      border="1px solid rgba(255,255,255,0.25)"
      borderRadius="12px"
      p={3}
      color="white"
      fontFamily="monospace"
      boxShadow="0 8px 28px rgba(0,0,0,0.35)"
      fontSize="11px"
      lineHeight={1.35}
    >
      <Flex justifyContent="space-between" alignItems="center" mb={2}>
        <Text fontSize="12px" fontWeight="700">
          DEBUG PROGRESSION
        </Text>
        <Button size="xs" variant="outline" onClick={toggleHidden}>
          Hide
        </Button>
      </Flex>

      <Flex justifyContent="space-between">
        <Text>Runs completadas:</Text>
        <Text>{totalRuns}</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text>Max round histórica:</Text>
        <Text>{highestRoundEver}</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text>Run activa:</Text>
        <Text>{activeRun ? `#${activeRun.runNumber}` : "-"}</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text>Round actual:</Text>
        <Text>{activeRun?.currentRound ?? "-"}</Text>
      </Flex>

      <Box mt={2} mb={2} borderTop="1px solid rgba(255,255,255,0.2)" />

      <Text color="#8cd6ff" mb={1}>
        Próximo unlock
      </Text>
      {nextRule ? (
        <Box mb={2}>
          <Text>{nextRule.title}</Text>
          <Text opacity={0.9}>
            Requiere run {nextRule.condition.minRun} + round {nextRule.condition.minRound}
          </Text>
        </Box>
      ) : (
        <Text mb={2}>Árbol inicial completo</Text>
      )}

      <Text color="#8cd6ff" mb={1}>
        Desbloqueado ({unlockedRules.length})
      </Text>
      {unlockedRules.length === 0 ? (
        <Text mb={2} opacity={0.9}>
          Ninguno
        </Text>
      ) : (
        unlockedRules.map((rule) => (
          <Text key={`unlocked-${rule.system}`} mb={0.5}>
            - {rule.title}
          </Text>
        ))
      )}

      <Text color="#8cd6ff" mt={2} mb={1}>
        Falta desbloquear ({lockedRules.length})
      </Text>
      {lockedRules.length === 0 ? (
        <Text mb={2} opacity={0.9}>
          Ninguno
        </Text>
      ) : (
        lockedRules.map((rule) => (
          <Text key={`locked-${rule.system}`} mb={0.5}>
            - {rule.title} (run {rule.condition.minRun}, round {rule.condition.minRound})
          </Text>
        ))
      )}

      <Box mt={2} mb={2} borderTop="1px solid rgba(255,255,255,0.2)" />

      <Text color="#8cd6ff" mb={1}>
        Escalera completa
      </Text>
      {UNLOCK_PROGRESS_PATH.map((rule, index) => {
        const status = getRuleStatus(
          rule,
          unlockedSystems,
          totalRuns,
          highestRoundEver
        );

        return (
          <Box
            key={rule.system}
            mb={1.5}
            p={1.5}
            border="1px solid rgba(255,255,255,0.16)"
            borderRadius="8px"
            bg="rgba(255,255,255,0.03)"
          >
            <Flex justifyContent="space-between" alignItems="center" gap={2}>
              <Text>
                {index + 1}. {rule.title}
              </Text>
              <Text color={status.color}>{status.label}</Text>
            </Flex>
            <Text opacity={0.9}>
              Unlock en run {rule.condition.minRun} + round {rule.condition.minRound}
            </Text>
            {status.missingText && <Text opacity={0.9}>{status.missingText}</Text>}
          </Box>
        );
      })}
    </Box>
  );
};
