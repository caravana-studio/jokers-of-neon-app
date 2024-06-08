import { Box, Button, GridItem, Heading, SimpleGrid } from "@chakra-ui/react";
import { AccountAddress } from "../../components/AccountAddress.tsx";
import { CurrentPlay } from "../../components/CurrentPlay.tsx";
import { LevelPoints } from "../../components/LevelPoints.tsx";
import { MultiPoints } from "../../components/MultiPoints.tsx";
import { Score } from "../../components/Score.tsx";
import { useGameContext } from "../../providers/GameProvider.tsx";
import { PlaysLayout } from '../../components/Plays/PlaysLayout.tsx'
import { useState } from 'react'

export const TopSection = () => {
  const { gameId, executeCreateGame } = useGameContext();
  const [playsView, setPlaysView] = useState(false);

  return (
    <SimpleGrid columns={3}>
      <GridItem>
        <LevelPoints />
        <Button
          mt={8}
          variant="outline" onClick={(e) => {
          e.stopPropagation();
          setPlaysView(!playsView);
        }}>
          See plays
        </Button>
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
          {playsView && (
            <Box position={"relative"} zIndex={2}>
              <PlaysLayout />
            </Box>
          )}
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
