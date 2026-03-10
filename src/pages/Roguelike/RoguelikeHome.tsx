import { Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DelayedLoading } from "../../components/DelayedLoading";
import { useProgressStore } from "../../state/roguelike/useProgressStore";
import { useRunStore } from "../../state/roguelike/useRunStore";

const EMPTY_LOADOUT = {
  selectedUpgradeIds: [],
  selectedPactIds: [],
};

export const RoguelikeHome = () => {
  const navigate = useNavigate();

  const profile = useProgressStore((state) => state.profile);
  const isPrepareRunEnabled = useProgressStore((state) =>
    state.isPrepareRunEnabled()
  );

  const activeRun = useRunStore((state) => state.activeRun);
  const startRun = useRunStore((state) => state.startRun);

  const pendingUnlocksCount = profile?.pendingUnlocks.length ?? 0;

  const nextActionLabel = useMemo(() => {
    if (activeRun) {
      return "Continue Active Run";
    }

    return isPrepareRunEnabled ? "Prepare New Run" : "Start Run";
  }, [activeRun, isPrepareRunEnabled]);

  const handlePrimaryAction = async () => {
    if (activeRun) {
      navigate("/demo");
      return;
    }

    if (isPrepareRunEnabled) {
      navigate("/roguelike/prepare");
      return;
    }

    const run = await startRun({ loadout: EMPTY_LOADOUT });
    if (run) {
      navigate("/demo");
    }
  };

  return (
    <DelayedLoading ms={80}>
      <Flex
        h="100%"
        w="100%"
        justifyContent="center"
        alignItems="center"
        px={{ base: 4, md: 8 }}
      >
        <VStack
          spacing={5}
          w="100%"
          maxW="780px"
          bg="rgba(0, 0, 0, 0.55)"
          border="1px solid rgba(255,255,255,0.2)"
          borderRadius="16px"
          p={{ base: 5, md: 8 }}
          color="white"
          alignItems="stretch"
        >
          <Heading fontSize={{ base: "xl", md: "2xl" }}>Roguelike PoC</Heading>
          <Text fontSize={{ base: "sm", md: "md" }} opacity={0.85}>
            Estado mockeado + progresión persistida en localStorage. El front usa
            stores Zustand + GameApi desacoplada.
          </Text>

          <Flex justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Text>Runs completadas: {profile?.totalRuns ?? 0}</Text>
            <Text>Round máximo: {profile?.highestRoundEver ?? 0}</Text>
            <Text>Point cap: {profile?.pointCap ?? 0}</Text>
          </Flex>

          <Flex justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Text>Sistemas desbloqueados: {profile?.unlockedSystems.length ?? 0}</Text>
            <Text>Upgrades desbloqueados: {profile?.unlockedUpgradeIds.length ?? 0}</Text>
            <Text>Unlocks en cola: {pendingUnlocksCount}</Text>
          </Flex>

          <Flex gap={3} flexWrap="wrap">
            <Button onClick={handlePrimaryAction}>{nextActionLabel}</Button>
            <Button variant="secondarySolid" onClick={() => navigate("/")}>
              Back Home
            </Button>
            {activeRun && (
              <Button variant="outline" onClick={() => navigate("/store")}>
                Open Shop
              </Button>
            )}
            {pendingUnlocksCount > 0 && (
              <Button
                variant="outline"
                onClick={() => navigate("/roguelike/post-run")}
              >
                View Unlock
              </Button>
            )}
          </Flex>
        </VStack>
      </Flex>
    </DelayedLoading>
  );
};
