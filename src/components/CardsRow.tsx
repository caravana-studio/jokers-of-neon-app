import { Box, Flex, Menu, MenuItem, MenuList, useDisclosure } from "@chakra-ui/react"
import { CARD_HEIGHT_PX, CARD_WIDTH } from "../constants/visualProps";
import { Card } from "../types/Card";
import { AnimatedCard } from "./AnimatedCard";
import { TiltCard } from "./TiltCard";
import { useGameContext } from '../providers/GameProvider.tsx'
import { useState } from 'react'

interface CardsRowProps {
  cards: Card[];
}

export const CardsRow = ({ cards }: CardsRowProps) => {

  const [ discardedCards, setDiscardedCards] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { discardSpecialCard, discardAnimation } = useGameContext()
  const [ menuIdx, setMenuIdx] = useState<number | undefined>();

  return (
    <Flex width="100%" height={CARD_HEIGHT_PX} px={4}>
      {cards.map((card) => {
        const isDiscarded = discardedCards.includes(card.id);
        return (
          <Flex
            key={card.idx}
            justifyContent="center"
            width={`${100 / cards.length}%`}
            maxWidth={`${CARD_WIDTH + 7}px`}
          >
              <AnimatedCard
                idx={Number(card.id)}
                isSpecial={!!card.isSpecial}
                discarded={discardAnimation && isDiscarded}
              >
                <Box
                  onContextMenu={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setMenuIdx(card.idx);
                    onOpen();
                  }}>
                  <Menu isOpen={isOpen && menuIdx === card.idx} onClose={onClose}>
                    <MenuList
                      textColor="black"
                      minWidth="max-content"
                      borderRadius="0"
                      zIndex="7"
                    >
                      <MenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setDiscardedCards(prev => [...prev, card.id]);
                          discardSpecialCard(card.idx);
                          onClose();
                        }}
                        borderRadius="0"
                      >
                        Drop card
                      </MenuItem>
                    </MenuList>
                  </Menu>
                <TiltCard card={card} />
                </Box>
              </AnimatedCard>
          </Flex>
        );
      })}
    </Flex>
  );
};
