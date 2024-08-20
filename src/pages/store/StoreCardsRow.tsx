import { Box, Button, Flex, Heading, useBreakpoint } from "@chakra-ui/react";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import { TiltCard } from "../../components/TiltCard";
import { useStore } from "../../providers/StoreProvider";
import { Card } from "../../types/Card";
import { getCardUniqueId } from "../../utils/getCardUniqueId";
import { ShowCardModal } from "./ShowCardModal";

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
  const { buyCard, isPurchased } = useStore();

  const getCardScale = () => {
    // TODO: Remove after improve TiltCard styles
    // This code sets the required scale of the card to keep responsiveness
    const breakpoint = useBreakpoint();

    if (isMobile) {
      return 0.85;
    }

    if (breakpoint == "base") {
      return 0.75;
    } else if (breakpoint == "md") {
      return 0.81;
    }
    return 1;
  };

  return (
    <>
      <Box>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size={"s"} mb={[1, 1, 1, 2, 2]}>
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

        <Flex flexDirection="row" justifyContent="flex-start" gap={[2, 4, 6]}>
          {cards.map((card) => {
            const purchased = isPurchased(card);
            return (
              <Flex key={getCardUniqueId(card)} justifyContent="center">
                <TiltCard
                  cursor="pointer"
                  card={{ ...card, purchased }}
                  onClick={() => {
                    !isPurchased(card) && setSelectedCard(card);
                  }}
                  scale={getCardScale()}
                />
              </Flex>
            );
          })}
        </Flex>
      </Box>
      {selectedCard && (
        <ShowCardModal
          onBuyClick={() => {
            buyCard(selectedCard);
          }}
          card={selectedCard}
          close={() => setSelectedCard(undefined)}
        />
      )}
    </>
  );
};
