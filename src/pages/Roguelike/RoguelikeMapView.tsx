import { Box, Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { DelayedLoading } from "../../components/DelayedLoading";
import { useGameStore } from "../../state/useGameStore";
import { useRoguelikeRuntimeStore } from "../../state/roguelike/useRoguelikeRuntimeStore";
import { useRunStore } from "../../state/roguelike/useRunStore";

export const RoguelikeMapView = () => {
  const navigate = useNavigate();

  const mapOptions = useRoguelikeRuntimeStore((state) => state.mapOptions);
  const phase = useRoguelikeRuntimeStore((state) => state.phase);
  const chooseMapOption = useRoguelikeRuntimeStore((state) => state.chooseMapOption);
  const runtimeRound = useRoguelikeRuntimeStore((state) => state.round);
  const resetRuntime = useRoguelikeRuntimeStore((state) => state.reset);

  const activeRun = useRunStore((state) => state.activeRun);
  const advanceRound = useRunStore((state) => state.advanceRound);
  const endRun = useRunStore((state) => state.endRun);

  const handleOptionClick = async (optionId: string) => {
    const result = chooseMapOption(optionId);

    if (!result.nextPath) {
      return;
    }

    if (result.nextPath === "/demo") {
      await advanceRound();
    }

    useGameStore.setState({ state: result.nextGameState });
    navigate(result.nextPath);
  };

  const handleEndRun = async (result: "WIN" | "LOSS") => {
    if (!activeRun) {
      navigate("/roguelike");
      return;
    }

    const success = await endRun({
      result,
      highestRoundReached: Math.max(runtimeRound, activeRun.highestRoundReached),
    });

    if (success) {
      resetRuntime();
      navigate("/roguelike/post-run");
    }
  };

  return (
    <DelayedLoading ms={0}>
      <Flex h="100%" w="100%" justifyContent="center" alignItems="center" p={5}>
        <VStack
          spacing={4}
          maxW="840px"
          w="100%"
          p={{ base: 4, md: 6 }}
          bg="rgba(0,0,0,0.55)"
          border="1px solid rgba(255,255,255,0.2)"
          borderRadius="16px"
          color="white"
          alignItems="stretch"
        >
          <Heading size="lg">Map</Heading>
          <Text opacity={0.85}>
            Fase actual: {phase}. Elegí el próximo nodo para continuar la run.
          </Text>

          {mapOptions.map((option) => (
            <Box
              key={option.id}
              border="1px solid rgba(255,255,255,0.2)"
              borderRadius="12px"
              p={4}
              bg="rgba(0,0,0,0.3)"
            >
              <Flex justifyContent="space-between" alignItems="center" gap={4}>
                <Box>
                  <Heading size="sm">{option.title}</Heading>
                  <Text fontSize="sm" opacity={0.8}>
                    {option.description}
                  </Text>
                </Box>
                <Button onClick={() => void handleOptionClick(option.id)}>Go</Button>
              </Flex>
            </Box>
          ))}

          {mapOptions.length === 0 && (
            <Text opacity={0.8}>
              No hay nodos disponibles todavía. Completá un round para generar
              opciones de mapa.
            </Text>
          )}

          <Flex gap={3} flexWrap="wrap">
            <Button variant="secondarySolid" onClick={() => navigate("/demo")}>Back to Round</Button>
            <Button variant="outline" onClick={() => navigate("/roguelike")}>Back to Entry</Button>
            <Button colorScheme="green" onClick={() => void handleEndRun("WIN")}>
              End Run (Win)
            </Button>
            <Button colorScheme="red" onClick={() => void handleEndRun("LOSS")}>
              End Run (Loss)
            </Button>
          </Flex>
        </VStack>
      </Flex>
    </DelayedLoading>
  );
};
