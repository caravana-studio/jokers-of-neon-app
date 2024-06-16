import { Box, Flex, Heading } from "@chakra-ui/react";
import { useGame } from "../dojo/queries/useGame";
import { useRound } from "../dojo/queries/useRound";
import { PointBox } from "./MultiPoints";

export const LevelPoints = () => {
  const round = useRound();
  const game = useGame();
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
            {round.level_score}
          </Heading>
        </PointBox>
      </Flex>
      <Heading
        size="s"
        sx={{ mt: 4, fontSize: 20, width: 260 }}
        textAlign="center"
      >
        score {round.level_score} points <br /> to beat level {level ?? 0}
      </Heading>
    </Box>
  );
};
