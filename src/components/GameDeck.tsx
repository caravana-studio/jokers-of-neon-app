import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { CARD_WIDTH_PX } from "../constants/visualProps.ts";
import { useGameContext } from "../providers/GameProvider.tsx";
import { useGetDeck } from "../queries/useGetDeck.ts";

export const GameDeck = () => {
  const { gameId } = useGameContext();
  const { data: deck, refetch: refetchDeckData } = useGetDeck(gameId);

  return (
    <Flex flexDirection="column" alignItems='flex-end' gap={2}>
      <Text size='s' mr={2}>
        {`${deck.currentLength}/${deck.size}`}
      </Text>
      <Image
        sx={{ maxWidth: "unset" }}
        src={`Cards/Backs/back.png`}
        alt={`Ccard back`}
        width={CARD_WIDTH_PX}
      />
    </Flex>
  );
};
