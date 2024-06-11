import { Box, Button, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { LevelPoints } from "../../components/LevelPoints.tsx";
import { MultiPoints } from "../../components/MultiPoints.tsx";
import { PlaysLayout } from "../../components/Plays/PlaysLayout.tsx";
import { Score } from "../../components/Score.tsx";
import { SpecialCards } from "../../components/SpecialCards.tsx";
import { useGameContext } from "../../providers/GameProvider.tsx";

export const TopSection = () => {
  const { gameId, executeCreateGame } = useGameContext();
  const [playsView, setPlaysView] = useState(false);

  return (
    <Flex
      height="100%"
      width="100%"
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Box sx={{ ml: 10 }} width="320px">
        <LevelPoints />
      </Box>
      <Box sx={{ p: 2 }} minWidth="200px" backgroundColor="darkGrey">
        <SpecialCards />
      </Box>
      <Flex
        flexDirection="column"
        justifyContent="center"
        sx={{ mx: 3 }}
        height="100%"
        width="400px"
      >
        <Score />
        <MultiPoints />
        {playsView && (
          <Box position={"relative"} zIndex={2}>
            <PlaysLayout />
          </Box>
        )}
      </Flex>
    </Flex>
  );
};
