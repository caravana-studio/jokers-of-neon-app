import { Box, Flex, Text, useTheme } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  CARD_WIDTH_PX,
} from "../constants/visualProps";
import { useGameContext } from "../providers/GameProvider";
import { TiltCard } from "./TiltCard";

export const RageCards = () => {
  const { colors } = useTheme();
  const { rageCards } = useGameContext();

  return (
    <Box
      boxShadow={`0px 28px 20px -27px ${colors.neonPink}`}
      width={`${rageCards.length === 1 ? CARD_WIDTH : CARD_WIDTH * 1.5}px`}
    >
      <Flex height={`${CARD_HEIGHT + 8}px`}>
        {rageCards.map((card, index) => {
          return (
            <Flex
              width={
                rageCards.length === 1
                  ? CARD_WIDTH_PX
                  : `${65 / rageCards.length}%`
              }
            >
              <TiltCard card={card} key={index} />;
            </Flex>
          );
        })}
      </Flex>
      <Flex justifyContent="center" mt={1}>
        <Text size={{ base: "l", sm: "m" }}>Rage {!isMobile && "cards"}</Text>
      </Flex>
    </Box>
  );
};
