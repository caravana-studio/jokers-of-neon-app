import { Box, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { TiltCard } from "../../components/TiltCard";
import { CARD_HEIGHT, CARD_WIDTH } from "../../constants/visualProps";
import { SortBy } from "../../enums/sortBy";
import { BLUE_LIGHT } from "../../theme/colors";
import { Card } from "../../types/Card";
import { DeckFiltersState } from "../../types/DeckFilters";
import { sortCards } from "../../utils/sortCards";

const SCALE = 0.55;
const CUSTOM_CARD_WIDTH = CARD_WIDTH * SCALE;
const CUSTOM_CARD_HEIGHT = CARD_HEIGHT * SCALE;

interface DeckCardsGridProps {
  cards: Card[] | undefined;
  filters?: DeckFiltersState;
  usedCards?: Card[];
  onCardSelect?: (card: Card) => void;
  inBurn?: boolean;
}

export const DeckCardsGrid: React.FC<DeckCardsGridProps> = ({
  cards,
  filters,
  usedCards = [],
  onCardSelect,
  inBurn = false,
}) => {
  const { t } = useTranslation("game", { keyPrefix: "game.deck" });
  const hasFilters =
    filters?.isModifier != undefined ||
    filters?.isNeon != undefined ||
    filters?.suit != undefined;
  const sortedCards = hasFilters
    ? sortCards(cards ?? [], SortBy.RANK)
    : sortCards(cards ?? [], SortBy.SUIT);

  const [selectedCard, setSelectedCard] = useState<Card>();

  const filteredCards = sortedCards?.filter((card) => {
    let matchesFilter = true;

    if (filters) {
      if (filters.isNeon !== undefined) {
        matchesFilter = matchesFilter && card.isNeon === filters.isNeon;
      }

      if (filters.isModifier !== undefined) {
        matchesFilter = matchesFilter && card.isModifier === filters.isModifier;
      }

      if (filters.suit !== undefined) {
        matchesFilter = matchesFilter && card.suit === filters.suit;
      }
    }

    return matchesFilter;
  });

  const countUsedCards = (card: Card): number => {
    return usedCards.filter((usedCard) => usedCard.id === card.id).length;
  };

  return (
    <Box mb={4} overflow="visible">
      <Flex
        wrap="wrap"
        position="relative"
        w="100%"
        mb={4}
        overflow="visible"
        justifyContent="center"
        pr={`${CUSTOM_CARD_WIDTH / 2}px`}
      >
        {filteredCards?.map((card, index) => {
          const usedCount = countUsedCards(card);
          const opacity = usedCount > 0 ? 0.6 : 1;
          const borderRadius = isMobile ? "5px" : "8px";
          const isSelected = selectedCard?.id === card.id;

          return (
            <Box
              key={`${card.id}-${index}`}
              w={`${CUSTOM_CARD_WIDTH}px`}
              h={`${CUSTOM_CARD_HEIGHT}px`}
              position="relative"
              mr={`-${CUSTOM_CARD_WIDTH / 5}px`}
              mb={4}
              sx={{
                "& div": {
                  // background: "rgba(0,0,0,1)",
                  borderRadius: `${borderRadius}`,
                },
                "& img": {
                  opacity: `${opacity}`,
                },
                transform: isSelected
                  ? `scale(1.1) translateX(-10px)`
                  : "scale(1)",
                transition: "transform 0.3s ease, box-shadow 0.5s ease",
                borderRadius: borderRadius,
                boxShadow: isSelected ? `0 0 5px 5px ${BLUE_LIGHT}` : "none",
              }}
            >
              <TiltCard
                card={card}
                scale={SCALE}
                used={usedCount > 0}
                onClick={() => {
                  if (inBurn) {
                    if (selectedCard?.id === card.id) {
                      setSelectedCard(undefined);
                    } else {
                      setSelectedCard(card);
                    }
                    onCardSelect?.(card);
                  }
                }}
                onDeck
              />
            </Box>
          );
        })}
      </Flex>
      {(!filteredCards || filteredCards.length === 0) && (
        <Text color="white" size="l" textAlign="center">
          {t("no-cards")}
        </Text>
      )}
    </Box>
  );
};
