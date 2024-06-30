import { Box, Flex } from "@chakra-ui/react";
import { LevelPoints } from "../../components/LevelPoints.tsx";
import { MultiPoints } from "../../components/MultiPoints.tsx";
import { Score } from "../../components/Score.tsx";
import { SpecialCards } from "../../components/SpecialCards.tsx";

export const MobileTopSection = () => {
  return (
    <>
      <Flex justifyContent="space-between" mx={3} mt={4}>
        <Box>
          <LevelPoints />
        </Box>
        <Box>
          <Score />
          <MultiPoints />
        </Box>
      </Flex>
      <Flex backgroundColor="darkGrey" mx={2}>
        <SpecialCards />
      </Flex>
    </>
  );
};