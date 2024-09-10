import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Menu,
  MenuList,
  useDisclosure,
  IconButton,
  Tooltip,
  flexbox,
  Button,
} from "@chakra-ui/react";
import { CloseIcon, DeleteIcon } from "@chakra-ui/icons";
import { CARD_HEIGHT_PX, CARD_WIDTH } from "../constants/visualProps";
import { useGameContext } from "../providers/GameProvider.tsx";
import { Card } from "../types/Card";
import { AnimatedCard } from "./AnimatedCard";
import { TiltCard } from "./TiltCard";

interface CardsRowProps {
  cards: Card[];
}

export const CardsRow: React.FC<CardsRowProps> = ({ cards }) => {
  const [discardedCards, setDiscardedCards] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { discardSpecialCard, roundRewards } = useGameContext();
  const [menuIdx, setMenuIdx] = useState<number | undefined>();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredButton, setHoveredButton] = useState<number | null>(null);

  useEffect(() => {
    if (roundRewards) {
      setDiscardedCards((prev) => [
        ...prev,
        ...cards
          .filter((card) => card.temporary && card.remaining === 1)
          .map((card) => card.id),
      ]);
    }
  }, [roundRewards, cards]);

  const handleDiscard = (cardIdx: number) => {
    const card = cards.find((c) => c.idx === cardIdx);
    if (card) {
      discardSpecialCard(cardIdx).then((response) => {
        if (response) {
          setDiscardedCards((prev) => [...prev, card.id]);
        }
      });
    }
  };

  return (
    <Flex width="100%" height={CARD_HEIGHT_PX + 8}>
      {cards.map((card) => {
        const isDiscarded = discardedCards.includes(card.id);
        return (
          <Flex
            className="special-cards-step-1"
            key={card.idx}
            justifyContent="center"
            width={`${100 / cards.length}%`}
            maxWidth={`${CARD_WIDTH + 7}px`}
            position="relative"
            zIndex={1}
            onMouseEnter={() => setHoveredCard(card.idx)}
            onMouseLeave={() => {
              setHoveredCard(null);
              setHoveredButton(null);
            }}
          >
            {!isDiscarded && (
              <AnimatedCard idx={card.idx} isSpecial={!!card.isSpecial}>
                <Box
                  position="relative"
                >
                  <Flex position={"absolute"}
                        zIndex={7}
                        bottom={0}
                  >
                    {hoveredCard === card.idx && (  
                      <Button
                        variant={ "secondarySolid"}
                        onMouseEnter={() => setHoveredButton(card.idx)}
                      >
                        X
                      </Button>
                    )}
                    {hoveredButton === card.idx && (
                      <Button
                      right={2}
                        fontSize="8px"
                        variant={ "secondarySolid"}
                        onClick={() => handleDiscard(card.idx)}
                      >
                        Discard
                      </Button>
                    )}
                  </Flex>
                  <TiltCard card={card} />
                </Box>
              </AnimatedCard>
            )}
          </Flex>
        );
      })}
    </Flex>
  );
};