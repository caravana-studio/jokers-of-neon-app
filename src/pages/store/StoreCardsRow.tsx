import { Box, Button, Flex, Heading, SimpleGrid } from "@chakra-ui/react";
import { useState } from "react";
import { TiltCard } from "../../components/TiltCard";
import { useStore } from "../../providers/StoreProvider";
import { Card } from "../../types/Card";
import { getCardType } from "../../utils/getCardType";
import { getCardUniqueId } from "../../utils/getCardUniqueId";
import { ShowCardModal } from "./ShowCardModal";
import { useGameContext } from '../../providers/GameProvider.tsx'

interface CardsRowProps {
  title: string;
  cards: Card[];
  button?: {
    onClick: () => void;
    label: string;
  };
}

export const StoreCardsRow = ({ title, cards, button }: CardsRowProps) => {
  const [selectedCard, setSelectedCard] = useState<Card | undefined>();
  const { buyCard } = useStore();
  const { refetchDeckData } = useGameContext();

  return (
    <>
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
              <Flex key={getCardUniqueId(card)} justifyContent="center">
                <TiltCard
                  cursor="pointer"
                  card={card}
                  onClick={() => {
                    !card.purchased && setSelectedCard(card);
                  }}
                />
              </Flex>
            );
          })}
        </SimpleGrid>
      </Box>
      {selectedCard && (
        <ShowCardModal
          onBuyClick={() =>
            buyCard(
              selectedCard.idx,
              getCardType(selectedCard),
              selectedCard.price ?? 0
            ).then( async () => {
              await new Promise(r => setTimeout(r, 1000));
              refetchDeckData();
            })
          }
          card={selectedCard}
          close={() => setSelectedCard(undefined)}
        />
      )}
    </>
  );
};
