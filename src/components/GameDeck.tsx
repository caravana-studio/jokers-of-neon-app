import { Box, Image } from "@chakra-ui/react";
import { CARD_WIDTH_PX } from "../constants/visualProps.ts";
import { useGameContext } from "../providers/GameProvider.tsx";
import { useGetDeck } from "../queries/useGetDeck.ts";

export const GameDeck = () => {
  const { gameId } = useGameContext();
  const { data: deck, refetch: refetchDeckData } = useGetDeck(gameId);

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 7,
        right: 10,
      }}
    >
      <Image
        sx={{ maxWidth: "unset" }}
        src={`Cards/Backs/B1.png`}
        alt={`Cards/Backs/B1.png`}
        width={CARD_WIDTH_PX}
      />
      <Box pt={"5px"} textAlign={"left"}>
        {`${deck.currentLength}/${deck.size}`}
      </Box>
    </Box>
  );
};
