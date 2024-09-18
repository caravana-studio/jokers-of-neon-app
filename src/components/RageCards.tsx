import { Box, Flex, Text, useTheme } from "@chakra-ui/react";
import { CARD_HEIGHT } from "../constants/visualProps";
import { Card } from "../types/Card";
import { TiltCard } from "./TiltCard";

export const RageCards = () => {
  const rageCards: Card[] = [
    {
      name: "Silent Hearts",
      card_id: 401,
      img: "rage/401.png",
      id: "401",
      idx: 0,
    },
  ];
  const { colors } = useTheme();

  return (
    <Box boxShadow={`0px 28px 20px -27px ${colors.neonPink}`}>
      <Flex height={`${CARD_HEIGHT + 8}px`}>
        {rageCards.map((card, index) => {
          return <TiltCard card={card} key={index} />;
        })}
      </Flex>
      <Flex justifyContent="center" mt={1}>
        <Text size="md">Rage cards</Text>
      </Flex>
    </Box>
  );
};
