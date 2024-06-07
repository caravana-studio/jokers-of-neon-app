import { Box, Button, Flex, Heading, SimpleGrid } from "@chakra-ui/react";
import { TiltCard } from "../../components/TiltCard";
import { Card } from "../../types/Card";

interface CardsRowProps {
  title: string;
  cards: Card[];
  button?: {
    onClick: () => void;
    label: string;
  };
}
export const CardsRow = ({
  title,
  cards,
  button
}: CardsRowProps) => {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(0,0,0,0.7)",
        p: 2,
      }}
    >
      <Flex justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Heading variant="neonGreen" size="m" sx={{ mb: 2, ml: 3 }}>
          {title}
        </Heading>
        {button && (
          <Button
            variant="outline"
            sx={{ width: 300 }}
            onClick={button.onClick}
          >
            {button.label}
          </Button>
        )}
      </Flex>

      <SimpleGrid columns={cards.length}>
        {cards.map((card) => {
          return (
            <Flex key={card.id} justifyContent="center">
              <TiltCard card={card} />
            </Flex>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};
