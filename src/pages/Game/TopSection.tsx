import { Box, Flex, Text } from "@chakra-ui/react";
import CachedImage from "../../components/CachedImage.tsx";
import { LevelPoints } from "../../components/LevelPoints.tsx";
import { MultiPoints } from "../../components/MultiPoints.tsx";
import { Score } from "../../components/Score.tsx";
import { SpecialCards } from "../../components/SpecialCards.tsx";
import { useGameContext } from "../../providers/GameProvider.tsx";
import { PowerUps } from "./PowerUps.tsx";
import { ScoreTotal } from "../../components/ScoreTotal.tsx";

interface TopSectionProps {
  onTutorialCardClick?: () => void;
}

export const TopSection = ({ onTutorialCardClick }: TopSectionProps) => {
  const { maxPowerUpSlots } = useGameContext();
  return (
    <Flex flexDir="column">
      <Flex
        height="100%"
        width="100%"
        justifyContent={"space-between"}
        alignItems={"flex-start"}
        sx={{
          zIndex: 1,
        }}
      >
        <Box mr={4}>
          <CachedImage
            src="logos/logo-variant.svg"
            width={{ base: "110px", sm: "150px", md: "260px" }}
            alt="logo"
            mb="30px"
          />
          <LevelPoints />
        </Box>
        <Flex
          px={1}
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="flex-start"
          mx={1}
          gap={1}
          width={"100%"}
        >
          <SpecialCards />
        </Flex>
        <Flex
          flexDirection="column"
          ml={4}
          height="100%"
          justifyContent="flex-start"
        >
          <Score />
          <MultiPoints />
          <Box mt={4}>
            <ScoreTotal />
          </Box>
        </Flex>
      </Flex>
      {(maxPowerUpSlots === undefined || maxPowerUpSlots > 0) && (
        <Flex mt={-8} w="100%" justifyContent="center">
          <PowerUps onTutorialCardClick={onTutorialCardClick} />
        </Flex>
      )}
    </Flex>
  );
};
