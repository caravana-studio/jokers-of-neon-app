import { Box, Flex, Img } from "@chakra-ui/react";
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
      <Box mr={4}>
        <Img src="logos/logo-variant.png" width={{base: '120px', md: '330px'}} alt="logo" />
        <LevelPoints />
      </Box>
      <Flex
        mx={2}
        flexGrow={1}
        sx={{ p: 2 }}
        minWidth={{ base: "250px", md: "500px" }}
        maxWidth={`${(CARD_WIDTH + 20) * 5}px`}
      >
        <SpecialCards />
      </Flex>
      <Flex
        flexDirection="column"
        justifyContent="center"
        ml={4}
        height="100%"
      >
        <Score />
        <MultiPoints />
      </Flex>
    </Flex>
  );
};
