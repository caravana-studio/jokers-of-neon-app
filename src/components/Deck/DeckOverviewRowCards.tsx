import React, { useRef, useState, useEffect } from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react'
import { TiltCard } from '../TiltCard';
import { Card } from '../../types/Card';
import { CARD_HEIGHT, CARD_WIDTH } from '../../constants/visualProps.ts'

interface DeckOverviewRowCardsProps {
  cards: Card[];
  suit: string;
}

const SCALE = 0.45;
const CUSTOM_CARD_WIDTH = CARD_WIDTH * SCALE;
const CUSTOM_CARD_HEIGHT = CARD_HEIGHT * SCALE;

const DeckOverviewRowCards = ({ cards, suit }: DeckOverviewRowCardsProps) => {
  const labelRef = useRef(null);
  const [flexWidth, setFlexWidth] = useState(0);

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

  // Calculate card position based on index
  const calculateCardPosition = (index: number) => {
    if (cards.length === 1) return flexWidth / 2 - CUSTOM_CARD_WIDTH / 2; // Center single card

    const position = (flexWidth - CUSTOM_CARD_WIDTH) / (cards.length - 1) * index;
    // sum half of a card width to center the cards
    return position + CUSTOM_CARD_WIDTH / 2;
  };

  return (
    <Box mb={4}>
      <Flex justifyContent="start" mb={1} id="label" ref={labelRef}>
        <Heading size="s" color="white" textAlign="center">
          {suit}
        </Heading>
      </Flex>
      <Box position="relative" height={CUSTOM_CARD_HEIGHT} id="cards-container">
        {cards.map((card, index) => {
          const cardPosX = calculateCardPosition(index);
          return (
            <Box
              key={card.id+String(card.isModifier)}
              position="absolute"
              left={`${cardPosX}px`}
              m={1}
              transform={`translateX(-${CUSTOM_CARD_WIDTH / 2}px)`} // Adjust based on card width
            >
              <TiltCard card={card} scale={SCALE} />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default DeckOverviewRowCards;
