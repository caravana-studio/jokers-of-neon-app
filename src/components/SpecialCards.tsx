import { Box, Flex, Text } from "@chakra-ui/react";
import { Icons } from "../constants/icons.ts";
import { CARD_HEIGHT, CARD_WIDTH } from "../constants/visualProps.ts";
import { useGameStore } from "../state/useGameStore.ts";
import { useResponsiveValues } from "../theme/responsiveSettings.tsx";
import { CardContainerWithBorder } from "./CardContainerWithBorder.tsx";
import { IconComponent } from "./IconComponent.tsx";
import { RageCards } from "./RageCards.tsx";
import { SpecialCardsRow } from "./SpecialCardsRow.tsx";
import { SpecialRageSwitcher } from "./SpecialRageSwitcher.tsx";

export const SpecialCards = () => {
  const { specialSwitcherOn, specialSlots, maxSpecialCards } = useGameStore();
  const { isSmallScreen, cardScale } = useResponsiveValues();
  const heightOffset = isSmallScreen ? 25 : 40;
  const cardWidth = CARD_WIDTH * cardScale;
  const legacyMinSlots = 5;
  const minSlots = Math.max(1, maxSpecialCards);
  const containerMinSlots = Math.max(legacyMinSlots, minSlots);

  return (
    <CardContainerWithBorder
      maxWidth={isSmallScreen ? "95%" : "100%"}
      minWidth={`${cardWidth * containerMinSlots + (isSmallScreen ? 32 : 49)}px`}
      width={"auto"}
      height={`${CARD_HEIGHT * cardScale + heightOffset}px`}
    >
      {specialSwitcherOn ? <SpecialCardsRow /> : <RageCards />}
      <Flex
        position="absolute"
        right={{ base: 3, md: 4 }}
        mr={{ base: 1, md: "28px" }}
        bottom={{ base: 1, md: 2 }}
        alignItems="center"
        gap={{ base: 1, md: 1.5 }}
        zIndex={65}
        pointerEvents="none"
      >
        <IconComponent
          icon={Icons.LOCKED}
          width={isSmallScreen ? "8px" : "13px"}
          height={isSmallScreen ? "8px" : "13px"}
        />
        <Text
          color="white"
          size="s"
          fontWeight="500"
          fontSize={{ base: "10px", md: "13px", lg: "15px" }}
          lineHeight={1}
        >
          {specialSlots}/{maxSpecialCards}
        </Text>
      </Flex>
      <SpecialRageSwitcher />
    </CardContainerWithBorder>
  );
};
