import { Box, Button, GridItem, Heading, SimpleGrid } from "@chakra-ui/react";
import { AccountAddress } from "../../components/AccountAddress.tsx";
import { CurrentPlay } from "../../components/CurrentPlay.tsx";
import { LevelPoints } from "../../components/LevelPoints.tsx";
import { MultiPoints } from "../../components/MultiPoints.tsx";
import { Score } from "../../components/Score.tsx";
import { useGameContext } from "../../providers/GameProvider.tsx";

export const TopSection = () => {
  const { gameId, executeCreateGame } = useGameContext();
  return (
    <SimpleGrid columns={3}>
      <GridItem>
        <LevelPoints />
      </GridItem>
      <GridItem>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Score />
          <CurrentPlay />
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
