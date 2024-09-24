import { Box, Button, Flex, Heading, useBreakpoint } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { TiltCard } from "../../components/TiltCard";
import { useStore } from "../../providers/StoreProvider";
import { Card } from "../../types/Card";
import { getCardUniqueId } from "../../utils/getCardUniqueId";
import { useNavigate } from "react-router-dom";
import { preloadImages } from "../../utils/preloadImages";

interface CardsRowProps {
  title: string;
  cards: Card[];
  button?: {
    onClick: () => void;
    label: string;
  };
}

export const StoreCardsRow = ({ title, cards, button }: CardsRowProps) => {
  const navigate = useNavigate();
  const { buyCard, isPurchased } = useStore();
  const imageUrls = cards.map((card) => {
    return card.isSpecial || card.isModifier 
      ? `Cards/effect/big/${card.card_id}.png` 
      : `Cards/big/${card.img}`;
  });
  
  preloadImages(imageUrls).then(() => {
  }).catch((error) => {
    console.error("Error preloading card images:", error);
  });

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
      <Box mb={4}>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size={{base: "s", sm: "xs"}} mb={[1, 1, 1, 2, 2]} fontWeight={"400"}>
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
                    if(!isPurchased(card)){
                      navigate("/preview-card", { state: { card: card, isPack: false } });
                    }
                  }}
                  scale={getCardScale()}
                />
              </Flex>
            );
          })}
        </Flex>
      </Box>
    </>
  );
};
