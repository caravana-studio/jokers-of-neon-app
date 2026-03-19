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
          bottom: inStore ? "16px" : { base: "16px", md: "67px" },
          top: "auto",
          right: inStore ? "20px" : { base: "16px", md: "40px" },
        }}
        onMouseEnter={() => !inStore && setIsDeckTableVisible(true)}
        onMouseLeave={() => !inStore && setIsDeckTableVisible(false)}
      >
        <GameDeck inStore={inStore} />
      </Box>
    </>
  );
};
