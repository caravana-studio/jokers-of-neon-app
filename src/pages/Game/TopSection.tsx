import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { LevelPoints } from "../../components/LevelPoints.tsx";
import { MultiPoints } from "../../components/MultiPoints.tsx";
import { PlaysLayout } from "../../components/Plays/PlaysLayout.tsx";
import { Score } from "../../components/Score.tsx";
import { SpecialCards } from "../../components/SpecialCards.tsx";

export const TopSection = () => {
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
      <Flex
        mx={2}
        flexGrow={1}
        sx={{ p: 2 }}
        minWidth="500px"
        maxWidth="900px"
        backgroundColor="darkGrey"
      >
        <SpecialCards />
      </Flex>
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
