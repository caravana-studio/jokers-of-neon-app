import { useState } from "react";
import { MobileDecoration } from "../../components/MobileDecoration";
import { Flex, Tab, TabList, Tabs } from "@chakra-ui/react";
import { getDocCardsData } from "./Utils/DocsUtils";
import { CardDataMap } from "../../types/CardData";
import { TiltCard } from "../../components/TiltCard";

export const DocsCardsRow = ({ cardDataMap }: { cardDataMap: CardDataMap }) => {
  const docCards = getDocCardsData(cardDataMap);

  return (
    <>
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
            <TiltCard card={docCardData.card} scale={0.9} />
          </Flex>
        ))}
      </Flex>
    </>
  );
};
