import { Box, Flex } from "@chakra-ui/react";
import CachedImage from "../../components/CachedImage.tsx";
import { LevelPoints } from "../../components/LevelPoints.tsx";
import { MultiPoints } from "../../components/MultiPoints.tsx";
import { Score } from "../../components/Score.tsx";
import { SpecialCards } from "../../components/SpecialCards.tsx";
import { PowerUps } from "./PowerUps.tsx";

export const TopSection = () => {
  return (
    <Flex flexDir="column">
      <Flex
        height="100%"
        width="100%"
        justifyContent={"space-between"}
        alignItems={"flex-start"}
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
          px={2}
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="flex-start"
          mx={2}
          gap={2}
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
        </Flex>
      </Flex>
      <Flex mt={-9} w="100%" justifyContent="center">
        <PowerUps />
      </Flex>
    </Flex>
  );
};
