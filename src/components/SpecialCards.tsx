import { Box, Flex, Text, useTheme } from "@chakra-ui/react";
import { useCurrentSpecialCards } from "../dojo/queries/useCurrentSpecialCards.tsx";
import { useGame } from "../dojo/queries/useGame";
import { CardsRow } from "./CardsRow";

interface SpecialCardsProps {
  inStore?: boolean;
}

export const SpecialCards = ({ inStore = false }: SpecialCardsProps) => {
  const { colors } = useTheme();
  const game = useGame();
  const maxLength = game?.len_max_current_special_cards ?? 5;
  const specialCards = useCurrentSpecialCards();

  return (
    <Box
      width="100%"
      p={2}
      boxShadow={inStore ? "none" : `0px 26px 30px -30px ${colors.neonGreen}`}
    >
      <CardsRow cards={specialCards} />
      <Flex sx={{ mt: 1 }} justifyContent="space-between">
        <Box>{!inStore && <Text size="l">Special cards</Text>}</Box>
        <Text size="l">
          {"<"}
          {specialCards.length}/{maxLength}
          {">"}
        </Text>
      </Flex>
    </Box>
  );
};
