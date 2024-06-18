import React, { useEffect, useRef, useState } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { TiltCard } from '../TiltCard'
import { Card } from '../../types/Card'
import { CARD_HEIGHT, CARD_WIDTH } from '../../constants/visualProps.ts'
import { sortCards } from '../../utils/sortCards.ts'
import { SortBy } from '../../enums/sortBy.ts'

interface DeckOverviewRowCardsProps {
  cards: Card[];
}

const MIN_SCREEN_HEIGHT = 720;
const MIN_SCALE = 0.5;

const DeckOverviewRowCards = ({ cards }: DeckOverviewRowCardsProps) => {
  const labelRef = useRef(null);
  const [flexWidth, setFlexWidth] = useState(0);
  const [scale, setScale] = useState(0.5);
  const CUSTOM_CARD_WIDTH = CARD_WIDTH * scale;
  const CUSTOM_CARD_HEIGHT = CARD_HEIGHT * scale;

  // Effect to update flexWidth when label width changes
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setFlexWidth(entry.contentRect.width);
      }
    });

    if (labelRef.current) {
      resizeObserver.observe(labelRef.current);
    }

    return () => {
      if (labelRef.current) {
        resizeObserver.unobserve(labelRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const clientHeight = document.body.clientHeight;
    if(clientHeight <= MIN_SCREEN_HEIGHT) {
      setScale(0.5);
    }
    const scale = (clientHeight * MIN_SCALE) / MIN_SCREEN_HEIGHT;
    setScale(scale);
  }, [document.body.clientHeight]);

  // Calculate card position based on index
  const calculateCardPosition = (index: number) => {
    if (cards.length === 1) return flexWidth / 2 - CUSTOM_CARD_WIDTH / 2; // Center single card

    const position = (flexWidth - CUSTOM_CARD_WIDTH) / (cards.length - 1) * index;
    // sum half of a card width to center the cards
    return position + CUSTOM_CARD_WIDTH / 2;
  };

  return (
    <Box mb={4}>
      <Flex justifyContent="start" id="label" ref={labelRef}>
      </Flex>
      <Box position="relative" height={CUSTOM_CARD_HEIGHT} id="cards-container">
        {
          sortCards(cards, SortBy.RANK)
            .reverse()
            .map((card, index) => {
              const cardPosX = calculateCardPosition(index);
              return (
                <Box
                  key={card.id+String(card.isModifier)}
                  position="absolute"
                  left={`${cardPosX}px`}
                  m={1}
                  transform={`translateX(-${CUSTOM_CARD_WIDTH / 2}px)`} // Adjust based on card width
                >
                  <TiltCard card={card} scale={scale} />
                </Box>
              );
            })
        }
      </Box>
    </Box>
  );
};

export default DeckOverviewRowCards;
