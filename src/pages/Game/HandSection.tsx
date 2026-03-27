import { Box, Flex } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import { ReactNode, RefObject } from "react";
import { CardContainerWithBorder } from "../../components/CardContainerWithBorder";
import { ShowPlays } from "../../components/ShowPlays";
import { SortBy } from "../../components/SortBy";
import { HAND_SECTION_ID } from "../../constants/general";
import { CARD_HEIGHT, CARD_WIDTH } from "../../constants/visualProps";
import { useGameStore } from "../../state/useGameStore";
import { useResponsiveValues } from "../../theme/responsiveSettings";

interface HandSectionProps {
  onTutorialCardClick?: () => void;
  cardsAnchorRef?: RefObject<HTMLDivElement>;
}

export const HandSection = ({
  onTutorialCardClick: _onTutorialCardClick,
  cardsAnchorRef,
}: HandSectionProps) => {
  const { roundRewards } = useGameStore();
  const { cardScale, isSmallScreen } = useResponsiveValues();

  const cardHeight = CARD_HEIGHT * cardScale;
  const handContainerWidth =
    CARD_WIDTH * cardScale * 6 + (isSmallScreen ? 32 : 50);
  const desktopSideColumnWidthPx = Math.max(
    96,
    Math.round(CARD_WIDTH * cardScale * 0.78)
  );
  const renderedCardHeight =
    (CARD_HEIGHT + (isSmallScreen ? 12 : 8)) * cardScale;
  const { setNodeRef } = useDroppable({
    id: HAND_SECTION_ID,
  });

  return (
    <Box
      pr={0}
      pl={0}
      className="game-tutorial-step-2 tutorial-modifiers-step-1"
      ref={setNodeRef}
      height={isSmallScreen ? renderedCardHeight + 8 : "100%"}
      width="100%"
      flex={1}
      minWidth={0}
      display={"flex"}
      alignItems={"end"}
    >
      <HandSectionContainer>
        <Flex
          width="100%"
          alignItems="flex-end"
          justifyContent={!isSmallScreen ? "center" : "flex-start"}
          gap={!isSmallScreen ? 4 : 0}
        >
          {!isSmallScreen && (
            <Flex
              flexDirection="column"
              justifyContent="flex-end"
              pb={1}
              height={cardHeight}
              gap={1}
              width={`${desktopSideColumnWidthPx}px`}
              flexShrink={0}
              sx={{
                zIndex: 40,
              }}
            >
              <SortBy />
            </Flex>
          )}
          <Flex
            alignItems="flex-end"
            width="100%"
            justifyContent="center"
          >
            <Box
              ref={cardsAnchorRef}
              opacity={!roundRewards ? 1 : 0.3}
              minWidth={isSmallScreen ? "100%" : `${handContainerWidth}px`}
              maxWidth={isSmallScreen ? "100%" : `${handContainerWidth}px`}
              w={isSmallScreen ? "100%" : `${handContainerWidth}px`}
              flexShrink={0}
              h={`${renderedCardHeight + 4}px`}
              position="relative"
            >
              {!isSmallScreen && (
                <Flex
                  bottom={"-35px"}
                  right={"16px"}
                  alignItems="flex-end"
                  position="absolute"
                >
                  <ShowPlays />
                </Flex>
              )}
            </Box>
          </Flex>
          {!isSmallScreen && (
            <Box
              width={`${desktopSideColumnWidthPx}px`}
              flexShrink={0}
              opacity={0}
              pointerEvents="none"
              aria-hidden
            />
          )}
        </Flex>
      </HandSectionContainer>
    </Box>
  );
};

const HandSectionContainer = ({ children }: { children: ReactNode }) => {
  const { cardScale, isSmallScreen } = useResponsiveValues();
  const renderedCardHeight =
    (CARD_HEIGHT + (isSmallScreen ? 12 : 8)) * cardScale;
  return isSmallScreen ? (
    <CardContainerWithBorder
      width="100%"
      minWidth="0"
      maxWidth="95%"
      paddingLeft={[0, 0]}
      paddingRight={[0, 0]}
      height={`${renderedCardHeight + 16}px`}
    >
      <SortBy />
      {children}
    </CardContainerWithBorder>
  ) : (
    <>{children}</>
  );
};
