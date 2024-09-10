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

  console.log(hoveredCard);

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
                  <Flex position={"absolute"} zIndex={7} bottom={2}
left={2}>
                  {hoveredCard === card.idx && (
                        
                        <IconButton
                          aria-label="Card options"
                          icon={<CloseIcon />}
                          size="sm"
                          colorScheme="gray"
                          opacity={0.7}
                          onMouseEnter={() => setHoveredButton(card.idx)}
                        />
                      
                    )}
                    {hoveredButton === card.idx && (
                      
                        <IconButton
                          aria-label="Discard card"
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          opacity={0.7}
                          onClick={() => handleDiscard(card.idx)}
                        />
                      
                    )}
                    </Flex>
                  
                  {/* <Menu
                    isOpen={hoveredCard === card.idx}
                  >
                    <MenuList
                      minWidth="max-content"
                      zIndex="7"
                    >
                      {hoveredCard === card.idx && (
                        
                          <IconButton
                            aria-label="Card options"
                            icon={<CloseIcon />}
                            position="absolute"
                            size="sm"
                            colorScheme="gray"
                            opacity={0.7}
                            onMouseEnter={() => setHoveredButton(card.idx)}
                          />
                        
                      )}
                      {hoveredButton === card.idx && (
                        
                          <IconButton
                            aria-label="Discard card"
                            icon={<DeleteIcon />}
                            size="sm"
                            colorScheme="red"
                            opacity={0.7}
                            onClick={() => handleDiscard(card.idx)}
                          />
                        
                      )}
                    </MenuList>
                  </Menu> */}
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