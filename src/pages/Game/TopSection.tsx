import { Box, Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import CachedImage from "../../components/CachedImage.tsx";
import CompactRoundData from "../../components/CompactRoundData/CompactRoundData.tsx";
import { CurrentPlay } from "../../components/CurrentPlay.tsx";
import { MultiPoints } from "../../components/MultiPoints.tsx";
import { Plays } from "../../enums/plays";
import { useCurrentHandStore } from "../../state/useCurrentHandStore";
import { SpecialCards } from "../../components/SpecialCards.tsx";
import { useGameStore } from "../../state/useGameStore.ts";
import { PowerUps } from "./PowerUps.tsx";

interface TopSectionProps {
  onTutorialCardClick?: () => void;
}

export const TopSection = ({ onTutorialCardClick }: TopSectionProps) => {
  const { powerUps } = useGameStore();
  const { preSelectedPlay } = useCurrentHandStore();
  const { t } = useTranslation(["game"]);
  const showPowerUps = powerUps.some((powerUp) => powerUp !== null);
  const showCurrentPlayLogo = preSelectedPlay === Plays.NONE;

  return (
    <Flex flexDir="column">
      <Flex
        position="relative"
        height="100%"
        width="100%"
        alignItems="flex-start"
        display="grid"
        gridTemplateColumns="minmax(0, 1fr) auto minmax(0, 1fr)"
        columnGap={{ base: 3, lg: 6 }}
        sx={{
          overflow: "visible",
        }}
      >
        <Box
          width="100%"
          maxW="100%"
          position="relative"
          zIndex={120}
          overflow="visible"
        >
          <CompactRoundData
            showPointsAndMulti={false}
            showFooter
            levelBoxFullWidth
            desktopTypographyBoost
            levelBottomSpacing={{ base: 0.5, md: 3 }}
            maxW="100%"
            px={0}
          />
        </Box>
        <Flex
          justifyContent="center"
          alignItems="flex-start"
          width="100%"
          position="relative"
          zIndex={300}
          sx={{
            "& .special-cards-step-3": {
              margin: 0,
            },
          }}
          mr={8}
        >
          <SpecialCards />
        </Flex>
        <Flex
          direction="column"
          width="100%"
          alignItems="stretch"
          gap={3}
          position="relative"
        >
          <Flex
            width="100%"
            minH={{ base: "52px", lg: "62px" }}
            border="1px solid"
            borderColor="whiteAlpha.500"
            borderRadius="12px"
            alignItems="center"
            justifyContent="center"
            px={3}
            position="relative"
          >
            <CurrentPlay
              showEmptyText={false}
              fontFamily="Sonara"
              desktopFontSize={16}
              mobileFontSize={16}
            />
            {showCurrentPlayLogo && (
              <Flex
                position="absolute"
                inset={0}
                alignItems="center"
                justifyContent="center"
                pointerEvents="none"
              >
                <CachedImage
                  src="logos/logo-variant.svg"
                  width={{ base: "130px", md: "180px" }}
                  alt="logo"
                />
              </Flex>
            )}
          </Flex>

          <Flex width="100%">
            <MultiPoints />
          </Flex>

          {showPowerUps && (
            <Box mt={4}>
              <Flex
                alignItems="center"
                gap={2}
                mb={2}
                textTransform="uppercase"
                opacity={0.9}
              >
                <Text
                  fontSize="10px"
                  letterSpacing="0.08em"
                  whiteSpace="nowrap"
                >
                  {t("game.compact-round-data.power-ups")}
                </Text>
                <Box h="1px" width="100%" bg="whiteAlpha.500" />
              </Flex>
              <Flex
                width="100%"
                justifyContent="flex-start"
                position="relative"
                zIndex={420}
              >
                <PowerUps onTutorialCardClick={onTutorialCardClick} />
              </Flex>
            </Box>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
