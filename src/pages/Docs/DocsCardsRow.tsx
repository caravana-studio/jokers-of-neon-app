import { Flex, useBreakpointValue } from "@chakra-ui/react";
import { getSortedDocCardsData } from "./Utils/DocsUtils";
import { TiltCard } from "../../components/TiltCard";
import { useCardHighlight } from "../../providers/CardHighlightProvider";
import { MobileCardHighlight } from "../../components/MobileCardHighlight";
import { isMobile } from "react-device-detect";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { useCardData } from "../../providers/CardDataProvider";

export const DocsCardsRow = ({ cardIds }: { cardIds: number[] }) => {
    const { getCardData } = useCardData();
  
  const docCards = getSortedDocCardsData(cardIds, getCardData);
  const { highlightCard, highlightedCard } = useCardHighlight();
  const { isSmallScreen } = useResponsiveValues();

  const customCardScale = useBreakpointValue(
    {
      base: 0.9,
      sm: 1,
      md: 1.2,
      lg: 1.5,
      xl: 2,
    },
    { ssr: false }
  );

  return (
    <>
      {highlightedCard && (
        <MobileCardHighlight card={highlightedCard} showExtraInfo />
      )}

      <Flex
        width={isSmallScreen ? "100%" : "90%"}
        height={["90%"]}
        margin={"0 auto"}
        my={[4, 2]}
        flexDirection="row"
        alignItems={"center"}
        justifyContent={"center"}
        alignContent={"flex-start"}
        wrap={"wrap"}
        gap={2}
        overflow={"auto"}
        pt={isMobile ? 0 : 2}
      >
        {docCards.map((docCardData, index) => (
          <Flex key={index} justifyContent={"center"} alignItems={"center"}>
            <TiltCard
              card={{ ...docCardData, price: undefined }}
              scale={customCardScale}
              onClick={() => {
                highlightCard(docCardData);
              }}
              cursor="pointer"
            />
          </Flex>
        ))}
      </Flex>
    </>
  );
};
