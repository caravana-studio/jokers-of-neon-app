import {
  Box,
  Button,
  Flex,
  GridItem,
  Heading,
  SimpleGrid,
} from "@chakra-ui/react";
import { AccountAddress } from "../../components/AccountAddress.tsx";
import { MultiPoints, PointBox } from "../../components/MultiPoints.tsx";
import { RollingNumber } from "../../components/RollingNumber.tsx";
import { PLAYS } from "../../constants/plays.ts";
import { useGameContext } from "../../providers/GameProvider.tsx";

export const TopSection = () => {
  const { gameId, round, game, preSelectedPlay, executeCreateGame } =
    useGameContext();
    
  const score = round.score;
  const level = game.level;

  return (
    <SimpleGrid columns={3}>
      <GridItem>
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
      </GridItem>
      <GridItem>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Heading
            variant="neonWhite"
            size="l"
            sx={{
              mb: 4,
            }}
          >
            SCORE: <RollingNumber n={score} />
          </Heading>
          <Heading variant="neonGreen" size="m" sx={{ mb: 2 }}>
            CURRENT PLAY: {PLAYS[preSelectedPlay]}
          </Heading>
          <MultiPoints />
        </Box>
      </GridItem>
      <GridItem>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            right: 10,
            top: 10,
            gap: 2,
            alignItems: "end",
          }}
        >
          <AccountAddress />
          <Heading size="s" textAlign={"right"}>
            game id: {gameId}
          </Heading>
          <Button
            variant="outline"
            sx={{ width: 300 }}
            onClick={(e) => {
              e.stopPropagation();
              executeCreateGame();
            }}
          >
            START NEW GAME
          </Button>
        </Box>
      </GridItem>
    </SimpleGrid>
  );
};
