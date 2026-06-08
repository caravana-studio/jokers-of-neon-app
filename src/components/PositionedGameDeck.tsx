import { Box } from "@chakra-ui/react";
import { RefObject } from "react";
import { useGameQuickPreviewStore } from "../state/useGameQuickPreviewStore";
import { GameDeck } from "./GameDeck";

interface PositionedGameDeckProps {
  inStore?: boolean;
  deckAnchorRef?: RefObject<HTMLDivElement>;
}

export const PositionedGameDeck = ({
  inStore = false,
  deckAnchorRef,
}: PositionedGameDeckProps) => {
  const setPreviewType = useGameQuickPreviewStore(
    (store) => store.setPreviewType,
  );
  const clearPreviewType = useGameQuickPreviewStore(
    (store) => store.clearPreviewType,
  );

  return (
    <Box
      ref={deckAnchorRef}
      sx={{
        position: "fixed",
        zIndex: 900,
        bottom: inStore ? "16px" : { base: "16px", md: "67px" },
        top: "auto",
        right: inStore ? "20px" : { base: "16px", md: "40px" },
      }}
      onMouseEnter={() => !inStore && setPreviewType("deck")}
      onMouseLeave={() => !inStore && clearPreviewType("deck")}
    >
      <GameDeck inStore={inStore} />
    </Box>
  );
};
