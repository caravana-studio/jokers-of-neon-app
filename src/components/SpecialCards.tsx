import { Box, Flex, Heading } from "@chakra-ui/react";
import { useCurrentSpecialCards } from "../dojo/queries/useCurrentSpecialCards";
import { useGame } from "../dojo/queries/useGame";
import { CardsRow } from "./CardsRow";

export const SpecialCards = () => {
  const game = useGame()
  const maxLength = game?.len_max_current_special_cards ?? 5
  const specialCards = useCurrentSpecialCards();
  return (
    <Box width="100%" p={2}>
      <CardsRow cards={specialCards} />
      <Flex sx={{ px: 4, mt: 1 }} justifyContent="space-between">
        <Heading size="s">special cards</Heading>
        <Heading size="s">({specialCards.length}/{maxLength})</Heading>
      </Flex>
    </Box>
  );
};
