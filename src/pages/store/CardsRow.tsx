import { Heading, SimpleGrid } from "@chakra-ui/react";
import { TiltCard } from "../../components/TiltCard";
import { Card } from "../../types/Card";

interface CardsRowProps {
  title: string;
  cards: Card[];
}
export const CardsRow = ({ title, cards }: CardsRowProps) => {
  return (
    <>
      <Heading variant="neonGreen" size="m" sx={{ mb: 2 }}>
        {title}
      </Heading>
      <SimpleGrid columns={cards.length}>
        {cards.map((card) => {
          return <TiltCard card={card} />;
        })}
      </SimpleGrid>
    </>
  );
};
