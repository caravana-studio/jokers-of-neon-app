import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useGame } from "../dojo/queries/useGame";
import { useGameContext } from "../providers/GameProvider";
import { useGetRound } from "../queries/useGetRound";
import { PointBox } from "./MultiPoints";
import { Score } from "./Score";

export const LevelPoints = () => {
  const game = useGame();
  const { gameId } = useGameContext();
  const { data: round } = useGetRound(gameId);
  const level = game?.level ?? 0;

  return (
    <Box className="game-tutorial-step-1">
      <Flex gap={8}>
        <PointBox type="level">
          <Heading size="s">LEVEL</Heading>
          <Heading size="m" sx={{ color: "white" }}>
            {level ?? 0}
          </Heading>
        </PointBox>
        <PointBox type="points">
          <Heading size="s">POINTS</Heading>
          <Heading size="m" px={2}>
            {round.levelScore}
          </Heading>
        </PointBox>
      </Flex>
      <Text size="s" mt={{ base: 3, md: 6 }} textAlign="center">
        score {round.levelScore} points to beat level {level ?? 0}
      </Text>
    </Box>
  );
};

export const MobileLevelPoints = () => {
  const game = useGame();
  const { gameId } = useGameContext();
  const { data: round } = useGetRound(gameId);
  const level = game?.level ?? 0;
  return (
    <Flex gap={2.5} alignItems="center">
      <Flex
        border="1px solid white"
        borderRadius={10}
        px={1.5}
        height={10}
        alignItems="center"
      >
        <Heading fontSize={21} >
          {level ?? 0}
        </Heading>
      </Flex>
      <Flex flexDirection='column' gap={1} justifyContent={'center'}>
        <Text size="m" lineHeight={1} mt={2}>
          score {round.levelScore} points  to beat level {level ?? 0}
        </Text>
        <Score />
      </Flex>
    </Flex>
  );
};
