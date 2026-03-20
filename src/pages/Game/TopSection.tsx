import { Box, Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import CachedImage from "../../components/CachedImage.tsx";
import { SpecialCards } from "../../components/SpecialCards.tsx";
import { PowerUps } from "./PowerUps.tsx";
import { useGameStore } from "../../state/useGameStore.ts";
import CompactRoundData from "../../components/CompactRoundData/CompactRoundData.tsx";

interface TopSectionProps {
  onTutorialCardClick?: () => void;
}

export const TopSection = ({ onTutorialCardClick }: TopSectionProps) => {
  const { powerUps } = useGameStore();
  const { t } = useTranslation(["game"]);
  const showPowerUps = powerUps.some((powerUp) => powerUp !== null);

  return (
    <Flex flexDir="column">
      <Box position="absolute" top={"35px"} right={"10px"}>
        <CachedImage
          src="logos/logo-variant.svg"
          width={"150px"}
          alt="logo"
        />
      </Box>
      <Flex
        position="relative"
        height="100%"
        width="100%"
        justifyContent={"space-between"}
        alignItems={"flex-start"}
        sx={{
          zIndex: 300,
          overflow: "visible",
        }}
      >
        <Box
          mr={4}
          maxW={{ base: "300px", lg: "560px" }}
          width="100%"
          position="relative"
          zIndex={120}
          overflow="visible"
        >
          <CompactRoundData
            showFooter
            levelBoxFullWidth
            desktopTypographyBoost
            levelBottomSpacing={{ base: 0.5, md: 3 }}
            maxW={{ base: "300px", lg: "560px" }}
            px={0}
          />
          {showPowerUps && (
            <Box mt={3}>
              <Flex
                alignItems="center"
                gap={2}
                mb={2}
                textTransform="uppercase"
                opacity={0.9}
              >
                <Text fontSize="10px" letterSpacing="0.08em" whiteSpace="nowrap">
                  {t("game.compact-round-data.power-ups")}
                </Text>
                <Box h="1px" width="100%" bg="whiteAlpha.500" />
              </Flex>
              <Flex justifyContent="flex-start" position="relative" zIndex={200}>
                <PowerUps onTutorialCardClick={onTutorialCardClick} />
              </Flex>
            </Box>
          )}
        </Box>
        <Flex
          flexDirection="row"
          justifyContent="flex-end"
          alignItems="flex-start"
          gap={1}
          pr={0}
          mr={0}
          width={"100%"}
          sx={{
            "& .special-cards-step-3": {
              margin: 0,
            },
          }}
        >
          <SpecialCards />
        </Flex>
      </Flex>
    </Flex>
  );
};
