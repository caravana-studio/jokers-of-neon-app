import { Box } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import { RefObject } from "react";
import { CurrentPlay } from "../../components/CurrentPlay.tsx";
import { PRESELECTED_CARD_SECTION_ID } from "../../constants/general.ts";
import { CARD_HEIGHT } from "../../constants/visualProps.ts";
import { useResponsiveValues } from "../../theme/responsiveSettings.tsx";

interface MobilePreselectedCardsSectionProps {
  cardsAnchorRef?: RefObject<HTMLDivElement>;
}

export const MobilePreselectedCardsSection = ({
  cardsAnchorRef,
}: MobilePreselectedCardsSectionProps) => {
  const { cardScale } = useResponsiveValues();

  const { setNodeRef } = useDroppable({
    id: PRESELECTED_CARD_SECTION_ID,
  });

  const cardHeight = cardScale * CARD_HEIGHT;

  return (
    <Box
      className="tutorial-modifiers-step-center"
      gap={1}
      py={2}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: `${cardHeight + 70}px`,
        width: "100%",
        zIndex: 1,
      }}
      mb={1}
      ref={setNodeRef}
    >
      <Box
        ref={cardsAnchorRef}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "no-wrap",
          width: "95%",
          height: "100%",
        }}
        background={"url(grid.png)"}
        backgroundSize={"contain"}
        gap={[4, 8]}
      />
      <CurrentPlay />
    </Box>
  );
};
