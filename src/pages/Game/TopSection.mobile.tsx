import { Flex } from "@chakra-ui/react";
import { MobileLevelPoints } from "../../components/LevelPoints.tsx";
import { MultiPoints } from "../../components/MultiPoints.tsx";
import { RageCards } from "../../components/RageCards.tsx";
import { SpecialCards } from "../../components/SpecialCards.tsx";
import { useGameContext } from "../../providers/GameProvider.tsx";

export const MobileTopSection = () => {
  const { isRageRound } = useGameContext();

  return (
    <>
      <Flex justifyContent="space-between" mx={3}>
        <MobileLevelPoints />

        <MultiPoints />
      </Flex>
      <Flex backgroundColor="rgba(0,0,0,0.3)" width={["90%", "80%"]} sx={{margin: "0 auto", marginTop: ["4px", "24px"]}} mx={2}>
        <SpecialCards />
        {isRageRound && <RageCards />}
      </Flex>
    </>
  );
};
