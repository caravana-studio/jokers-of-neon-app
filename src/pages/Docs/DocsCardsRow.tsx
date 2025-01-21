import { Flex, useBreakpointValue } from "@chakra-ui/react";
import { getSortedDocCardsData } from "./Utils/DocsUtils";
import { CardDataMap } from "../../types/CardData";
import { TiltCard } from "../../components/TiltCard";
import { useCardHighlight } from "../../providers/CardHighlightProvider";
import { MobileCardHighlight } from "../../components/MobileCardHighlight";

export const DocsCardsRow = ({ cardDataMap }: { cardDataMap: CardDataMap }) => {
  const docCards = getSortedDocCardsData(cardDataMap);
  const { highlightCard, highlightedCard } = useCardHighlight();

  const customCardScale = useBreakpointValue(
    {
      base: 0.9,
      sm: 1,
      md: 1.2,
      lg: 1.5,
      xl: 3,
    },
    { ssr: false }
  );

  return (
    <>
      {highlightedCard && (
        <MobileCardHighlight card={highlightedCard} showExtraInfo />
      )}

      <Flex
        width="100%"
        height={["90%"]}
        my={[4, 2]}
        flexDirection="row"
        alignItems={"center"}
        justifyContent={"center"}
        alignContent={"flex-start"}
        wrap={"wrap"}
        gap={2}
        overflow={"auto"}
      >
        {docCards.map((docCardData, index) => (
          <Flex key={index} justifyContent={"center"} alignItems={"center"}>
            <TiltCard
              card={{ ...docCardData, price: undefined }}
              scale={customCardScale}
              onClick={() => {
                highlightCard(docCardData);
              }}
            />
          </Flex>
        ))}
      </Flex>
    </>
  );
};
