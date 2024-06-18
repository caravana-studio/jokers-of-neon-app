import { Box, Image, Tooltip, useDisclosure } from "@chakra-ui/react"
import { CARD_WIDTH_PX } from "../constants/visualProps.ts";
import { useGameContext } from "../providers/GameProvider.tsx";
import { useGetDeck } from "../queries/useGetDeck.ts";
import { DeckModal } from './Deck/DeckModal.tsx'

export const GameDeck = () => {
  const { gameId } = useGameContext();
  const { data: deck, refetch: refetchDeckData } = useGetDeck(gameId);
  const { isOpen: isDeckOverview, onClose, onOpen } = useDisclosure();

  const path = window.location.pathname;

  const isPlayerPlaying = path.includes("/demo");

  const commonCards = isPlayerPlaying ? deck.currentCommonCards : deck.commonCards;
  const effectCards = isPlayerPlaying ? deck.currentEffectCards : deck.effectCards;
  const currentLength = isPlayerPlaying ? deck.currentLength : deck.size;

  return (
    <Tooltip label="See deck" placement="top">
      <Box onClick={onOpen}>
        <DeckModal isOpen={isDeckOverview} onClose={onClose} commonCards={commonCards} effectCards={effectCards} />
        <Image
          sx={{ maxWidth: "unset" }}
          src={`Cards/Backs/B1.png`}
          alt={`Cards/Backs/B1.png`}
          width={CARD_WIDTH_PX}
        />
        <Box pt={"5px"} textAlign={"left"}>
          {`${currentLength}/${deck.size}`}
        </Box>
      </Box>
    </Tooltip>
  );
};
