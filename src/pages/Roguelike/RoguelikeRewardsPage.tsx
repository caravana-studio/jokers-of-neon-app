import { Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { DelayedLoading } from "../../components/DelayedLoading";
import { GameStateEnum } from "../../dojo/typescript/custom";
import { useGameStore } from "../../state/useGameStore";
import { useRoguelikeRuntimeStore } from "../../state/roguelike/useRoguelikeRuntimeStore";

export const RoguelikeRewardsPage = () => {
  const navigate = useNavigate();

  const rewards = useRoguelikeRuntimeStore((state) => state.rewards);
  const continueFromRewardsToMap = useRoguelikeRuntimeStore(
    (state) => state.continueFromRewardsToMap
  );

  const currentScore = useGameStore((state) => state.currentScore);

  const handleContinue = () => {
    continueFromRewardsToMap();
    useGameStore.setState({ state: GameStateEnum.Map });
    navigate("/map");
  };

  if (!rewards) {
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
          <Heading size="md">No rewards available</Heading>
          <Button onClick={() => navigate("/demo")}>Back to Round</Button>
        </VStack>
      </Flex>
    );
  }

  return (
    <DelayedLoading ms={0}>
      <Flex h="100%" w="100%" justifyContent="center" alignItems="center" p={5}>
        <VStack
          spacing={4}
          maxW="760px"
          w="100%"
          p={{ base: 4, md: 6 }}
          bg="rgba(0,0,0,0.55)"
          border="1px solid rgba(255,255,255,0.2)"
          borderRadius="16px"
          color="white"
          alignItems="stretch"
        >
          <Heading size="lg">Round Rewards</Heading>
          <Text>Round: {rewards.roundNumber}</Text>
          <Text>Final Score: {currentScore}</Text>
          <Text>Base Reward: {rewards.round_defeat}</Text>
          <Text>Hands Left Bonus: {rewards.hands_left_cash}</Text>
          <Text>Discards Left Bonus: {rewards.discard_left_cash}</Text>
          <Text>Rage Bonus: {rewards.rage_card_defeated_cash}</Text>
          <Text>Level Bonus: {rewards.level_bonus}</Text>
          <Heading size="md" color="cyan.300">
            Total: {rewards.total}
          </Heading>

          <Flex gap={3} flexWrap="wrap">
            <Button onClick={handleContinue}>Continue to Map</Button>
            <Button variant="secondarySolid" onClick={() => navigate("/demo")}>Back to Round</Button>
          </Flex>
        </VStack>
      </Flex>
    </DelayedLoading>
  );
};
