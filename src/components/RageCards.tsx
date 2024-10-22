import { Box, Flex, Text, useTheme } from "@chakra-ui/react";
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  CARD_WIDTH_PX,
} from "../constants/visualProps";
import { useGameContext } from "../providers/GameProvider";
import { TiltCard } from "./TiltCard";
import { useResponsiveValues } from "../theme/responsiveSettings";

export const RageCards = () => {
  const { colors } = useTheme();
  const { rageCards } = useGameContext();
  const { isSmallScreen, cardScale } = useResponsiveValues();

  return (
    <Box
      boxShadow={`0px 28px 20px -27px ${colors.neonPink}`}
      ml={1}
      width={`${rageCards.length === 1 ? CARD_WIDTH * cardScale : CARD_WIDTH * cardScale * 1.5}px`}
    >
      <Flex height={`${(CARD_HEIGHT + 8) * cardScale}px`}>
        {rageCards.map((card, index) => {
          return (
            <Flex
              width={
                rageCards.length === 1
                  ? `${CARD_WIDTH * cardScale}px`
                  : `${65 / rageCards.length}%`
              }
            >
              <TiltCard card={card} scale={cardScale} key={index} />;
            </Flex>
          );
        })}
      </Flex>
      <Flex justifyContent="center" mt={1}>
        <Text size={{ base: "l", sm: "m" }}>
          Rage {!isSmallScreen && "cards"}
        </Text>
      </Flex>
    </Box>
  );
};
