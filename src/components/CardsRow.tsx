import {
  Box,
  Flex,
  Menu,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CARD_HEIGHT_PX, CARD_WIDTH } from "../constants/visualProps";
import { useGameContext } from "../providers/GameProvider.tsx";
import { Card } from "../types/Card";
import { AnimatedCard } from "./AnimatedCard";
import { TiltCard } from "./TiltCard";

interface CardsRowProps {
  cards: Card[];
}

export const CardsRow = ({ cards }: CardsRowProps) => {
  const [discardedCards, setDiscardedCards] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { discardSpecialCard, roundRewards } = useGameContext();
  const [menuIdx, setMenuIdx] = useState<number | undefined>();

  useEffect(() => {
    if (roundRewards) {
      setDiscardedCards((prev) => [
        ...prev,
        ...cards
          .filter((card) => card.temporary && card.remaining === 1)
          .map((card) => card.id),
      ]);
    }
  }, [roundRewards]);

  return (
    <Flex width="100%" height={CARD_HEIGHT_PX} >
      {cards.map((card) => {
        const isDiscarded = discardedCards.includes(card.id);
        return (
          <Flex
            key={card.idx}
            justifyContent="center"
            width={`${100 / cards.length}%`}
            maxWidth={`${CARD_WIDTH + 7}px`}
            position="relative"
            zIndex={1}
          >
            {!isDiscarded && (
              <AnimatedCard idx={card.idx} isSpecial={!!card.isSpecial}>
                <Box
                  onContextMenu={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setMenuIdx(card.idx);
                    onOpen();
                  }}
                >
                  <Menu
                    isOpen={isOpen && menuIdx === card.idx}
                    onClose={onClose}
                  >
                    <MenuList
                      textColor="black"
                      minWidth="max-content"
                      zIndex="7"
                    >
                      <MenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          discardSpecialCard(card.idx).then((response) => {
                            if (response) {
                              setDiscardedCards((prev) => [...prev, card.id]);
                            }
                          });
                          onClose();
                        }}
                      >
                        Drop card
                      </MenuItem>
                    </MenuList>
                  </Menu>
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
