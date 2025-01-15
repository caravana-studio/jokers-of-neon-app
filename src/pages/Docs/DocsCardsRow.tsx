import { MobileDecoration } from "../../components/MobileDecoration";
import { Flex, Tab, TabList, Tabs } from "@chakra-ui/react";
import { getDocCardsData } from "./Utils/DocsUtils";
import { CardDataMap } from "../../types/CardData";
import { TiltCard } from "../../components/TiltCard";
import { useCardHighlight } from "../../providers/CardHighlightProvider";
import { MobileCardHighlight } from "../../components/MobileCardHighlight";

export const DocsCardsRow = ({ cardDataMap }: { cardDataMap: CardDataMap }) => {
  const docCards = getDocCardsData(cardDataMap);
  const { highlightCard, highlightedCard } = useCardHighlight();

  return (
    <>
      {highlightedCard && (
        <MobileCardHighlight card={highlightedCard} showExtraInfo />
      )}

      <Flex
        width="100%"
        height="100%"
        flexDirection="row"
        alignItems={"center"}
        justifyContent={"center"}
        alignContent={"flex-start"}
        wrap={"wrap"}
        gap={2}
        overflow={"scroll"}
      >
        {docCards.map((docCardData, index) => (
          <Flex key={index} justifyContent={"center"} alignItems={"center"}>
            <TiltCard
              card={{ ...docCardData, price: undefined }}
              scale={0.9}
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
