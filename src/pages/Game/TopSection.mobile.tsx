import { Flex } from "@chakra-ui/react";
import { MobileLevelPoints } from "../../components/LevelPoints.tsx";
import { MultiPoints } from "../../components/MultiPoints.tsx";
import { SpecialCards } from "../../components/SpecialCards.tsx";

export const MobileTopSection = () => {
  return (
    <>
      <Flex justifyContent="space-between" mx={3}>
        <MobileLevelPoints />

        <MultiPoints />
      </Flex>
      <Flex backgroundColor="rgba(0,0,0,0.3)" mx={2}>
        <SpecialCards />
      </Flex>
    </>
  );
};
