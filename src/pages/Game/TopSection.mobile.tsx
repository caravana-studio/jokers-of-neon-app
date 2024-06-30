import { Flex } from "@chakra-ui/react";
import {
  MobileLevelPoints
} from "../../components/LevelPoints.tsx";
import { MultiPoints } from "../../components/MultiPoints.tsx";
import { Score } from "../../components/Score.tsx";
import { SpecialCards } from "../../components/SpecialCards.tsx";

export const MobileTopSection = () => {
  return (
    <>
      <Flex justifyContent="space-between" mx={3}>
        <Flex gap={0.5} flexDirection="column"mt={2} alignItems="center">
          <MobileLevelPoints />
          <Score />
        </Flex>
        <MultiPoints />
      </Flex>
      <Flex backgroundColor="darkGrey" mx={2}>
        <SpecialCards />
      </Flex>
    </>
  );
};
