import { Flex } from "@chakra-ui/react";
import { Card } from "../types/Card";
import { TiltCard } from "./TiltCard";

interface CardsRowProps {
  cards: Card[];
}

export const CardsRow = ({ cards }: CardsRowProps) => {
  return (
    <Flex justifyContent={"space-between"} width="100%" px={4}>
      {cards.map((card) => {
        return (
          <Flex justifyContent="center" width={`${100 / cards.length}%`}>
            <TiltCard card={card} />
          </Flex>
        );
      })}
    </Flex>
  );
};
