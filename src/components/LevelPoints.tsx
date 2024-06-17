import { Box, Flex, Heading } from "@chakra-ui/react";
import { useGame } from "../dojo/queries/useGame";
import { useGameContext } from "../providers/GameProvider";
import { useGetRound } from "../queries/useGetRound";
import { PointBox } from "./MultiPoints";

export const LevelPoints = () => {
  const game = useGame();
  const { gameId } = useGameContext();
  const { data: round } = useGetRound(gameId);
  const level = game?.level ?? 0;

  return (
    <Box>
      <Flex gap={4}>
        <PointBox type="level">
          <Heading size="s">LEVEL</Heading>
          <Heading size="l" sx={{ color: "white" }}>
            {level ?? 0}
          </Heading>
        </PointBox>
        <PointBox type="points">
          <Heading size="s">POINTS</Heading>
          <Heading size="l" sx={{ color: "neonGreen", px: 2 }}>
            {round.levelScore}
          </Heading>
        </PointBox>
      </Flex>
      <Heading
        size="s"
        sx={{ mt: 4, fontSize: 20, width: 260 }}
        textAlign="center"
      >
        score {round.levelScore} points <br /> to beat level {level ?? 0}
      </Heading>
    </Box>
  );
};
