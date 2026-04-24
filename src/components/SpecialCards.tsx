import { Box, Flex, Text } from "@chakra-ui/react";
import { Icons } from "../constants/icons.ts";
import { CARD_HEIGHT } from "../constants/visualProps.ts";
import { useGameStore } from "../state/useGameStore.ts";
import { useResponsiveValues } from "../theme/responsiveSettings.tsx";
import { CardContainerWithBorder } from "./CardContainerWithBorder.tsx";
import { IconComponent } from "./IconComponent.tsx";
import { RageCards } from "./RageCards.tsx";
import { SpecialCardsRow } from "./SpecialCardsRow.tsx";
import { SpecialRageSwitcher } from "./SpecialRageSwitcher.tsx";

export const SpecialCards = () => {
  const { specialSwitcherOn, specialSlots, maxSpecialCards, isRageRound } =
    useGameStore();
  const { isSmallScreen, cardScale } = useResponsiveValues();
  const heightOffset = isSmallScreen ? 25 : 40;
  const containerWidth = isSmallScreen ? "calc(100vw - 32px)" : "45vw";
  const isShowingSpecialCards = !isRageRound || specialSwitcherOn;

  return (
    <CardContainerWithBorder
      maxWidth={containerWidth}
      minWidth={containerWidth}
      width={containerWidth}
      height={`${CARD_HEIGHT * cardScale + heightOffset}px`}
      className="progressive-special-cards-tutorial-target"
    >
      <Box
        position="relative"
        width="100%"
        height="100%"
        display="flex"
        alignItems="center"
      >
        <Box
          position="relative"
          width="100%"
          zIndex={isShowingSpecialCards ? 2 : 1}
          opacity={isShowingSpecialCards ? 1 : 0}
          pointerEvents={isShowingSpecialCards ? "auto" : "none"}
          transform={
            isShowingSpecialCards
              ? "translateY(0px) scale(1)"
              : "translateY(10px) scale(0.96)"
          }
          filter={isShowingSpecialCards ? "blur(0px)" : "blur(2px)"}
          willChange="opacity, transform, filter"
          transition="opacity 340ms cubic-bezier(0.22, 1, 0.36, 1), transform 340ms cubic-bezier(0.22, 1, 0.36, 1), filter 260ms ease"
        >
          <SpecialCardsRow />
        </Box>
        <Box
          position="absolute"
          inset={0}
          zIndex={isShowingSpecialCards ? 1 : 2}
          opacity={isShowingSpecialCards ? 0 : 1}
          pointerEvents={isShowingSpecialCards ? "none" : "auto"}
          transform={
            isShowingSpecialCards
              ? "translateY(10px) scale(0.96)"
              : "translateY(0px) scale(1)"
          }
          filter={isShowingSpecialCards ? "blur(2px)" : "blur(0px)"}
          display="flex"
          alignItems="center"
          willChange="opacity, transform, filter"
          transition="opacity 340ms cubic-bezier(0.22, 1, 0.36, 1), transform 340ms cubic-bezier(0.22, 1, 0.36, 1), filter 260ms ease"
        >
          <RageCards />
        </Box>
      </Box>
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
