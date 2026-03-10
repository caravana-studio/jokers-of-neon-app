import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getUnlockedRunUpgrades } from "../../domain/roguelike/catalog";
import { useProgressStore } from "../../state/roguelike/useProgressStore";
import { useRunStore } from "../../state/roguelike/useRunStore";

export const RoguelikeRunView = () => {
  const navigate = useNavigate();

  const profile = useProgressStore((state) => state.profile);

  const activeRun = useRunStore((state) => state.activeRun);
  const runError = useRunStore((state) => state.error);
  const advanceRound = useRunStore((state) => state.advanceRound);
  const defeatBoss = useRunStore((state) => state.defeatBoss);
  const buyRunUpgrade = useRunStore((state) => state.buyRunUpgrade);
  const endRun = useRunStore((state) => state.endRun);

  const unlockedRunUpgrades = useMemo(() => {
    if (!profile) {
      return [];
    }

    return getUnlockedRunUpgrades(profile).filter((upgrade) =>
      profile.unlockedUpgradeIds.includes(upgrade.id)
    );
  }, [profile]);

  const handleEndRun = async (result: "WIN" | "LOSS") => {
    if (!activeRun) {
      return;
    }

    const success = await endRun({
      result,
      highestRoundReached: activeRun.highestRoundReached,
    });

    if (success) {
      navigate("/roguelike/post-run");
    }
  };

  if (!activeRun) {
    return (
      <Flex h="100%" w="100%" justifyContent="center" alignItems="center" p={5}>
        <VStack
          spacing={4}
          p={6}
          maxW="560px"
          bg="rgba(0,0,0,0.55)"
          border="1px solid rgba(255,255,255,0.2)"
          borderRadius="16px"
          color="white"
        >
          <Heading size="md">No hay run activa</Heading>
          <Text opacity={0.85} textAlign="center">
            Iniciá una run nueva desde el entry point del modo roguelike.
          </Text>
          <Button onClick={() => navigate("/roguelike")}>Go to Entry</Button>
        </VStack>
      </Flex>
    );
  }

  return (
    <Flex h="100%" w="100%" justifyContent="center" alignItems="center" p={5}>
      <VStack
        spacing={4}
        maxW="960px"
        w="100%"
        p={{ base: 4, md: 6 }}
        bg="rgba(0,0,0,0.55)"
        border="1px solid rgba(255,255,255,0.2)"
        borderRadius="16px"
        color="white"
        alignItems="stretch"
      >
        <Heading size="lg">Run #{activeRun.runNumber}</Heading>

        <Flex gap={3} flexWrap="wrap">
          <Text>Round: {activeRun.currentRound}</Text>
          <Text>Highest: {activeRun.highestRoundReached}</Text>
          <Text>Plays: {activeRun.remainingPlays}/{activeRun.totalPlays}</Text>
          <Text>Discards: {activeRun.remainingDiscards}/{activeRun.totalDiscards}</Text>
          <Text>Gold: {activeRun.gold}</Text>
          <Text color="cyan.300">Temporary Points: {activeRun.temporaryPoints}</Text>
        </Flex>

        <HStack flexWrap="wrap" spacing={3}>
          <Button onClick={() => void advanceRound()}>Advance Round</Button>
          <Button onClick={() => void defeatBoss()} variant="outline">
            Defeat Boss (+temp points)
          </Button>
          <Button onClick={() => navigate("/roguelike/shop")} variant="outline">
            Open Shop
          </Button>
          <Button onClick={() => void handleEndRun("WIN")} colorScheme="green">
            End Run (Win)
          </Button>
          <Button onClick={() => void handleEndRun("LOSS")} colorScheme="red">
            End Run (Loss)
          </Button>
        </HStack>

        <Box>
          <Heading size="sm" mb={3}>
            Run Upgrades (temporary)
          </Heading>
          <VStack alignItems="stretch" spacing={2}>
            {unlockedRunUpgrades.map((upgrade) => {
              const bought = activeRun.temporaryUpgradeIds.includes(upgrade.id);
              const canAfford = activeRun.temporaryPoints >= upgrade.cost;

              return (
                <Box
                  key={upgrade.id}
                  border="1px solid rgba(255,255,255,0.22)"
                  borderRadius="12px"
                  p={3}
                  bg={bought ? "rgba(34,197,94,0.2)" : "rgba(0,0,0,0.35)"}
                >
                  <Flex justifyContent="space-between" alignItems="center" gap={2}>
                    <Box>
                      <Text fontWeight="bold">{upgrade.name}</Text>
                      <Text fontSize="sm" opacity={0.8}>
                        {upgrade.description}
                      </Text>
                    </Box>
                    <HStack>
                      <Text>Cost: {upgrade.cost}</Text>
                      <Button
                        size="sm"
                        isDisabled={bought || !canAfford}
                        onClick={() => void buyRunUpgrade(upgrade.id)}
                      >
                        {bought ? "Purchased" : "Buy"}
                      </Button>
                    </HStack>
                  </Flex>
                </Box>
              );
            })}
            {unlockedRunUpgrades.length === 0 && (
              <Text opacity={0.8}>No hay run upgrades desbloqueados.</Text>
            )}
          </VStack>
        </Box>

        {runError && (
          <Text color="red.300" fontSize="sm">
            {runError}
          </Text>
        )}
      </VStack>
    </Flex>
  );
};
