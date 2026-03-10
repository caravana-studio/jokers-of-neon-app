import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUnlockedPacts,
  getUnlockedPreRunUpgrades,
} from "../../domain/roguelike/catalog";
import { calculateLoadoutCost } from "../../domain/roguelike/loadout";
import { PactDefinition, UpgradeDefinition } from "../../domain/roguelike/types";
import { useProgressStore } from "../../state/roguelike/useProgressStore";
import { useRunStore } from "../../state/roguelike/useRunStore";

const EMPTY_LOADOUT = {
  selectedUpgradeIds: [],
  selectedPactIds: [],
};

const SelectionCard = ({
  title,
  subtitle,
  cost,
  selected,
  onToggle,
}: {
  title: string;
  subtitle: string;
  cost: number;
  selected: boolean;
  onToggle: () => void;
}) => {
  return (
    <Box
      border="1px solid rgba(255,255,255,0.22)"
      borderRadius="12px"
      p={3}
      bg={selected ? "rgba(59, 130, 246, 0.2)" : "rgba(0,0,0,0.35)"}
    >
      <Flex justifyContent="space-between" gap={3} alignItems="center">
        <Box>
          <Text fontWeight="bold">{title}</Text>
          <Text fontSize="sm" opacity={0.8}>
            {subtitle}
          </Text>
        </Box>
        <HStack spacing={2}>
          <Text minW="80px" textAlign="right">
            Cost: {cost}
          </Text>
          <Button size="sm" onClick={onToggle}>
            {selected ? "Remove" : "Add"}
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

const isUpgradeUnlocked = (
  item: UpgradeDefinition,
  unlockedIds: string[]
): boolean => unlockedIds.includes(item.id);

const isPactUnlocked = (item: PactDefinition, unlockedIds: string[]): boolean =>
  unlockedIds.includes(item.id);

export const PrepareRunView = () => {
  const navigate = useNavigate();

  const profile = useProgressStore((state) => state.profile);
  const isPrepareRunEnabled = useProgressStore((state) =>
    state.isPrepareRunEnabled()
  );
  const arePactsAvailable = useProgressStore((state) => state.arePactsAvailable());

  const startRun = useRunStore((state) => state.startRun);

  const [selectedUpgradeIds, setSelectedUpgradeIds] = useState<string[]>([]);
  const [selectedPactIds, setSelectedPactIds] = useState<string[]>([]);

  const unlockedPreRunUpgrades = useMemo(() => {
    if (!profile) {
      return [];
    }

    return getUnlockedPreRunUpgrades(profile).filter((upgrade) =>
      isUpgradeUnlocked(upgrade, profile.unlockedUpgradeIds)
    );
  }, [profile]);

  const unlockedPacts = useMemo(() => {
    if (!profile || !arePactsAvailable) {
      return [];
    }

    return getUnlockedPacts(profile).filter((pact) =>
      isPactUnlocked(pact, profile.unlockedPactIds)
    );
  }, [profile, arePactsAvailable]);

  useEffect(() => {
    const allowedUpgradeIds = new Set(unlockedPreRunUpgrades.map((item) => item.id));
    const allowedPactIds = new Set(unlockedPacts.map((item) => item.id));

    setSelectedUpgradeIds((previous) =>
      previous.filter((upgradeId) => allowedUpgradeIds.has(upgradeId))
    );
    setSelectedPactIds((previous) =>
      previous.filter((pactId) => allowedPactIds.has(pactId))
    );
  }, [unlockedPreRunUpgrades, unlockedPacts]);

  const loadoutCost = useMemo(() => {
    return calculateLoadoutCost(
      {
        selectedUpgradeIds,
        selectedPactIds,
      },
      unlockedPreRunUpgrades,
      unlockedPacts
    );
  }, [selectedUpgradeIds, selectedPactIds, unlockedPreRunUpgrades, unlockedPacts]);

  const pointCap = profile?.pointCap ?? 0;
  const pointsLeft = pointCap - loadoutCost;

  const toggleUpgrade = (upgradeId: string) => {
    setSelectedUpgradeIds((previous) => {
      if (previous.includes(upgradeId)) {
        return previous.filter((id) => id !== upgradeId);
      }

      return [...previous, upgradeId];
    });
  };

  const togglePact = (pactId: string) => {
    setSelectedPactIds((previous) => {
      if (previous.includes(pactId)) {
        return previous.filter((id) => id !== pactId);
      }

      return [...previous, pactId];
    });
  };

  const handleStartRun = async () => {
    const run = await startRun({
      loadout: isPrepareRunEnabled
        ? { selectedUpgradeIds, selectedPactIds }
        : EMPTY_LOADOUT,
    });

    if (run) {
      navigate("/demo");
    }
  };

  if (!isPrepareRunEnabled) {
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
          <Heading size="md">Prepare Run no está desbloqueado todavía</Heading>
          <Text opacity={0.85} textAlign="center">
            Seguí avanzando runs y rounds para desbloquear el loadout pre-run.
          </Text>
          <HStack>
            <Button onClick={handleStartRun}>Start Basic Run</Button>
            <Button variant="secondarySolid" onClick={() => navigate("/roguelike")}>Back</Button>
          </HStack>
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
        <Heading size="lg">Prepare Run</Heading>
        <Text opacity={0.85}>
          Elegí upgrades y pactos. Costos negativos en pactos te devuelven puntos.
        </Text>

        <Flex gap={4} flexWrap="wrap">
          <Text>Point cap: {pointCap}</Text>
          <Text>Selected cost: {loadoutCost}</Text>
          <Text color={pointsLeft < 0 ? "red.300" : "green.300"}>
            Points left: {pointsLeft}
          </Text>
        </Flex>

        <Box>
          <Heading size="sm" mb={3}>
            Upgrades
          </Heading>
          <VStack spacing={2} alignItems="stretch">
            {unlockedPreRunUpgrades.map((upgrade) => (
              <SelectionCard
                key={upgrade.id}
                title={`${upgrade.name} (${upgrade.rarity})`}
                subtitle={upgrade.description}
                cost={upgrade.cost}
                selected={selectedUpgradeIds.includes(upgrade.id)}
                onToggle={() => toggleUpgrade(upgrade.id)}
              />
            ))}
            {unlockedPreRunUpgrades.length === 0 && (
              <Text opacity={0.8}>No hay upgrades pre-run desbloqueados todavía.</Text>
            )}
          </VStack>
        </Box>

        <Box>
          <Heading size="sm" mb={3}>
            Pactos
          </Heading>
          <VStack spacing={2} alignItems="stretch">
            {unlockedPacts.map((pact) => (
              <SelectionCard
                key={pact.id}
                title={pact.name}
                subtitle={pact.description}
                cost={pact.cost}
                selected={selectedPactIds.includes(pact.id)}
                onToggle={() => togglePact(pact.id)}
              />
            ))}
            {unlockedPacts.length === 0 && (
              <Text opacity={0.8}>Pactos no disponibles hasta completar el árbol inicial.</Text>
            )}
          </VStack>
        </Box>

        <HStack>
          <Button onClick={handleStartRun} isDisabled={pointsLeft < 0}>
            Start Run
          </Button>
          <Button variant="secondarySolid" onClick={() => navigate("/roguelike")}>
            Back
          </Button>
        </HStack>
      </VStack>
    </Flex>
  );
};
