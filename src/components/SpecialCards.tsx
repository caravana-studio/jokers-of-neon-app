import { Box, Flex, Text, useTheme } from "@chakra-ui/react";
import { useCurrentSpecialCards } from "../dojo/queries/useCurrentSpecialCards";
import { useGame } from "../dojo/queries/useGame";
import { CardsRow } from "./CardsRow";

export const SpecialCards = () => {
  const { colors } = useTheme();
  const game = useGame();
  const maxLength = game?.len_max_current_special_cards ?? 5;
  const specialCards = useCurrentSpecialCards();
  return (
    <Box width="100%" p={2} boxShadow={`0px 26px 30px -30px ${colors.neonGreen}`}>
      <CardsRow cards={specialCards} />
      <Flex sx={{ mt: 1 }} justifyContent="space-between">
        <Text size="l">Special cards</Text>
        <Text size="l">
          {"<"}
          {specialCards.length}/{maxLength}
          {">"}
        </Text>
      </Flex>
    </Box>
  );
};
