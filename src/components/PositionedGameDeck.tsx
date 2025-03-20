import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { DeckPreviewTable } from "./DeckPreview/DeckPreviewTable";
import { GameDeck } from "./GameDeck";

interface PositionedGameDeckProps {
  inStore?: boolean;
}

export const PositionedGameDeck = ({
  inStore = false,
}: PositionedGameDeckProps) => {
  const [isDeckTableVisible, setIsDeckTableVisible] = useState(false);

  return (
    <>
      <Flex
        position={"absolute"}
        zIndex={1000}
        display={isDeckTableVisible ? "flex" : "none"}
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
      >
        <DeckPreviewTable />
      </Flex>

      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          right: 20,
        }}
        onMouseEnter={() => !inStore && setIsDeckTableVisible(true)}
        onMouseLeave={() => !inStore && setIsDeckTableVisible(false)}
      >
        <GameDeck inStore={inStore} />
      </Box>
    </>
  );
};
