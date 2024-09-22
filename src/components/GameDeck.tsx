import { Flex, Image, Text, Tooltip } from "@chakra-ui/react";
import { CARD_WIDTH_PX } from "../constants/visualProps.ts";
import { useCurrentDeck } from "../dojo/queries/useDeck.tsx";

export const GameDeck = () => {
  const deck = useCurrentDeck();

  return (
    <Tooltip label="See deck" placement="left-end" size="sm"> 
      <Flex flexDirection="column" alignItems='flex-end' gap={2} className="game-tutorial-step-8">
        <Text size='s' mr={2}>
          {`${deck?.currentLength}/${deck?.size}`}
        </Text>
        <Image
          sx={{ maxWidth: "unset" }}
          src={`Cards/Backs/back.png`}
          alt={`Ccard back`}
          width={CARD_WIDTH_PX}
        />
      </Flex>
    </Tooltip>
  );
};
