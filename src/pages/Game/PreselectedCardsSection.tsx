import { Box, Flex, Text } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import { RefObject } from "react";
import { useTranslation } from "react-i18next";
import { PRESELECTED_CARD_SECTION_ID } from "../../constants/general.ts";
import { CARD_HEIGHT } from "../../constants/visualProps.ts";
import { useCurrentHandStore } from "../../state/useCurrentHandStore.ts";
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
  const { preSelectedCards } = useCurrentHandStore();
  const { t } = useTranslation(["game"]);
  const { setNodeRef } = useDroppable({
    id: PRESELECTED_CARD_SECTION_ID,
  });
  const showEmptyHint = preSelectedCards.length === 0;
  const renderedCardHeight =
    (CARD_HEIGHT + (isSmallScreen ? 12 : 8)) * cardScale;

  return (
    <Flex
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      width={"100%"}
      height={"100%"}
      sx={{
        zIndex: 1,
      }}
    >
      <Flex
        flexDirection={"row"}
        width={"100%"}
        height={`${renderedCardHeight + 12}px`}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box
          className="game-tutorial-step-3"
          width="200px"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <DiscardButton
            inTutorial={inTutorial}
            highlight={highlightBtns}
            onTutorialCardClick={onTutorialCardClick}
          />
        </Box>

        <Box
          ref={setNodeRef}
          className="tutorial-modifiers-step-center"
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Flex
            ref={cardsAnchorRef}
            justifyContent="center"
            alignItems={"center"}
            height={`${renderedCardHeight + 12}px`}
            background={"url(grid.png)"}
            width="90%"
            backgroundRepeat="repeat-x"
            backgroundSize="auto 100%"
          />
          {showEmptyHint && (
            <Flex
              position="absolute"
              top={0}
              left="50%"
              transform="translateX(-50%)"
              width="90%"
              height={`${renderedCardHeight + 12}px`}
              alignItems="center"
              justifyContent="center"
              pointerEvents="none"
            >
              <Text
                fontSize={{ base: "16px", md: "20px" }}
                textAlign="center"
                color="whiteAlpha.900"
                textShadow="0 0 10px rgba(0, 0, 0, 0.7)"
              >
                {t("game.preselected-cards-section.current-play-lbl.default")}
              </Text>
            </Flex>
          )}
        </Box>
        <Box
          className="game-tutorial-step-4"
          width="200px"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <PlayButton
            inTutorial={inTutorial}
            highlight={highlightBtns}
            onTutorialCardClick={onTutorialCardClick}
          />
        </Box>
      </Flex>
    </Flex>
  );
};
