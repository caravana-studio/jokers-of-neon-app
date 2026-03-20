import { Box, Flex } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import { RefObject } from "react";
import { CurrentPlay } from "../../components/CurrentPlay.tsx";
import { PRESELECTED_CARD_SECTION_ID } from "../../constants/general.ts";
import { CARD_HEIGHT } from "../../constants/visualProps.ts";
import { useResponsiveValues } from "../../theme/responsiveSettings.tsx";
import { DiscardButton } from "./DiscardButton.tsx";
import { PlayButton } from "./PlayButton.tsx";

interface PreselectedCardsProps {
  inTutorial?: boolean;
  highlightBtns?: boolean;
  onTutorialCardClick?: () => void;
  cardsAnchorRef?: RefObject<HTMLDivElement>;
}

export const PreselectedCardsSection = ({
  inTutorial = false,
  highlightBtns = false,
  onTutorialCardClick,
  cardsAnchorRef,
}: PreselectedCardsProps) => {
  const { cardScale, isSmallScreen } = useResponsiveValues();
  const { setNodeRef } = useDroppable({
    id: PRESELECTED_CARD_SECTION_ID,
  });
  const renderedCardHeight =
    (CARD_HEIGHT + (isSmallScreen ? 12 : 8)) * cardScale;

  return (
    <Flex
      flexDirection={"column"}
      justifyContent={"space-around"}
      alignItems={"center"}
      width={"100%"}
      height={"100%"}
      sx={{
        zIndex: 1,
      }}
    >
      <Box height="60px"></Box>
      <Flex
        flexDirection={"row"}
        width={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box className="game-tutorial-step-3" width="200px">
          <DiscardButton
            inTutorial={inTutorial}
            highlight={highlightBtns}
            onTutorialCardClick={onTutorialCardClick}
          />
        </Box>

        <Box
          ref={setNodeRef}
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Flex
            ref={cardsAnchorRef}
            justifyContent="center"
            alignItems={"center"}
            height={`${renderedCardHeight + 12}px`}
            background={"url(grid.png)"}
            width="90%"
            backgroundRepeat="space"
            backgroundSize="52px auto"
          />
        </Box>
        <Box className="game-tutorial-step-4" width="200px">
          <PlayButton
            inTutorial={inTutorial}
            highlight={highlightBtns}
            onTutorialCardClick={onTutorialCardClick}
          />
        </Box>
      </Flex>
      <CurrentPlay />
    </Flex>
  );
};
