import { Flex } from "@chakra-ui/react";
import { Card } from "../types/Card";
import { TiltCard } from "./TiltCard";

interface CardsRowProps {
  cards: Card[];
}

export const CardsRow = ({ cards }: CardsRowProps) => {
  return (
    <Flex backgroundColor={"red"} gap={2} width="100%">
      {cards.map((card) => {
        return (
          <Flex width={`${100 / cards.length}%`} sx={{position: 'relative', right: 0}}>
            <TiltCard card={card} />
          </Flex>
        );
      })}
    </Flex>
  );
};
