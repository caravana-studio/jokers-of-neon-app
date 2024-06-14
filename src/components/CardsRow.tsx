import { Flex } from "@chakra-ui/react";
import { CARD_HEIGHT_PX, CARD_WIDTH } from "../constants/visualProps";
import { Card } from "../types/Card";
import { AnimatedCard } from "./AnimatedCard";
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
            key={card.idx}
            justifyContent="center"
            width={`${100 / cards.length}%`}
            maxWidth={`${CARD_WIDTH + 7}px`}
          >
            <AnimatedCard idx={card.idx} isSpecial={!!card.isSpecial}>
              <TiltCard card={card} />
            </AnimatedCard>
          </Flex>
        );
      })}
    </Flex>
  );
};
