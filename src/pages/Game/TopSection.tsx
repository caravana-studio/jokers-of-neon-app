import { Box, Flex } from "@chakra-ui/react";
import { LevelPoints } from "../../components/LevelPoints.tsx";
import { MultiPoints } from "../../components/MultiPoints.tsx";
import { Score } from "../../components/Score.tsx";
import { SpecialCards } from "../../components/SpecialCards.tsx";
import { CARD_WIDTH } from "../../constants/visualProps.ts";

export const TopSection = () => {
  return (
    <Flex
      height="100%"
      width="100%"
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Box ml={{ base: 4, md: 10 }} width={{ base: "160px", md: "320px" }}>
        <LevelPoints />
      </Box>
      <Flex
        mx={2}
        flexGrow={1}
        sx={{ p: 2 }}
        minWidth={{ base: "250px", md: "500px" }}
        maxWidth={`${(CARD_WIDTH + 20) * 5}px`}
        backgroundColor="darkGrey"
      >
        <SpecialCards />
      </Flex>
      <Flex
        flexDirection="column"
        justifyContent="center"
        sx={{ mx: 3 }}
        height="100%"
        width={{ base: "210px", md: "400px" }}
      >
        <Score />
        <MultiPoints />
      </Flex>
    </Flex>
  );
};
