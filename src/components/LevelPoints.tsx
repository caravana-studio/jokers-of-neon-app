import { Box, Flex, Heading } from "@chakra-ui/react";
import { useGameContext } from "../providers/GameProvider";
import { PointBox } from "./MultiPoints";

export const LevelPoints = () => {
  const { round, game } = useGameContext();
  const level = game.level;

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
