import { Flex } from "@chakra-ui/react";
import { CARD_HEIGHT_PX, CARD_WIDTH } from "../constants/visualProps";
import { Card } from "../types/Card";
import { TiltCard } from "./TiltCard";

interface CardsRowProps {
  cards: Card[];
}

export const CardsRow = ({ cards }: CardsRowProps) => {
  return (
    <Flex width="100%" height={CARD_HEIGHT_PX} px={4}>
      {cards.map((card) => {
        return (
          <Flex
            justifyContent="center"
            width={`${100 / cards.length}%`}
            maxWidth={`${CARD_WIDTH + 7}px`}
          >
            <TiltCard card={card} />
          </Flex>
        );
      })}
    </Flex>
  );
};
