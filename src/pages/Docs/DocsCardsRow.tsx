import { Flex, useBreakpointValue } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { MobileCardHighlight } from "../../components/MobileCardHighlight";
import { TiltCard } from "../../components/TiltCard";
import { useCardData } from "../../providers/CardDataProvider";
import { useCardHighlight } from "../../providers/HighlightProvider/CardHighlightProvider";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { Card } from "../../types/Card";
import { getSortedDocCardsData } from "./Utils/DocsUtils";

export const DocCardsContent = ({ cardIds }: { cardIds: number[] }) => {
  const { getCardData } = useCardData();

  const docCards = getSortedDocCardsData(cardIds, getCardData);
  const { highlightItem: highlightCard, highlightedItem: highlightedCard } =
    useCardHighlight();

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
    </>
  );
};

export const DocsCardsRow = ({ cardIds }: { cardIds: number[] }) => {
  const { isSmallScreen } = useResponsiveValues();

  return (
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
      <DocCardsContent cardIds={cardIds} />
    </Flex>
  );
};
