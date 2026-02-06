import { Box, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { useMemo } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { TiltCard } from "../../components/TiltCard";
import { CARD_HEIGHT, CARD_WIDTH } from "../../constants/visualProps";
import { Cards } from "../../enums/cards";
import { SortBy } from "../../enums/sortBy";
import { BLUE_LIGHT } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { Card } from "../../types/Card";
import { DeckFiltersState } from "../../types/DeckFilters";
import { sortCards } from "../../utils/sortCards";

interface DeckCardsGridProps {
  cards: Card[] | undefined;
  filters?: DeckFiltersState;
  usedCards?: Card[];
  onCardSelect?: (card: Card) => void;
  selectedCards?: Card[];
  inBurn?: boolean;
}

export const DeckCardsGrid: React.FC<DeckCardsGridProps> = ({
  cards = [],
  filters,
  usedCards = [],
  onCardSelect,
  selectedCards = [],
  inBurn = false,
}) => {
  const { isSmallScreen } = useResponsiveValues();
  const { t } = useTranslation("game", { keyPrefix: "game.deck" });

  const SCALE = useBreakpointValue(
    {
      base: isSmallScreen ? 0.55 : 0.85,
      xl: 1.8,
    },
    { ssr: false }
  );

  const CUSTOM_CARD_WIDTH = SCALE ? CARD_WIDTH * SCALE : CARD_WIDTH;
  const CUSTOM_CARD_HEIGHT = SCALE ? CARD_HEIGHT * SCALE : CARD_HEIGHT;

  // Create a Set of selected card IDs for efficient lookup
  const selectedCardIds = useMemo(
    () => new Set(selectedCards.map((c) => c.id)),
    [selectedCards]
  );

  // Memoize filtering condition
  const hasFilters = useMemo(
    () =>
      filters?.isModifier !== undefined ||
      filters?.isNeon !== undefined ||
      filters?.suit !== undefined ||
      filters?.isFigures !== undefined ||
      filters?.isAces !== undefined,
    [filters]
  );

  // Memoized sorting
  const sortedCards = useMemo(
    () => sortCards(cards, hasFilters ? SortBy.RANK : SortBy.SUIT),
    [cards, hasFilters]
  );

  // Memoized filtering
  const filteredCards = useMemo(() => {
    return sortedCards.filter((card) => {
      if (!filters) return true;

      return (
        (filters.isNeon === undefined || card.isNeon === filters.isNeon) &&
        (filters.isModifier === undefined ||
          card.isModifier === filters.isModifier) &&
        (filters.isFigures === undefined ||
          (card.card !== undefined &&
            (filters.isFigures
              ? [Cards.JACK, Cards.QUEEN, Cards.KING].includes(card.card)
              : ![Cards.JACK, Cards.QUEEN, Cards.KING].includes(card.card)))) &&
        (filters.isAces === undefined ||
          (filters.isAces
            ? card.card === Cards.ACE
            : card.card !== Cards.ACE)) &&
        (filters.suit === undefined || card.suit === filters.suit)
      );
    });
  }, [sortedCards, filters]);

  // Memoized used card count lookup table
  const usedCardCountMap = useMemo(() => {
    return usedCards.reduce<Record<string, number>>((acc, card) => {
      acc[card.id] = (acc[card.id] || 0) + 1;
      return acc;
    }, {});
  }, [usedCards]);

  return (
    <Box mb={4} overflow="visible" ml={[-3, -6]}>
      <Flex
        wrap="wrap"
        position="relative"
        w="100%"
        mb={4}
        pt={4}
        overflow="visible"
        justifyContent="center"
      >
        {filteredCards.map((card, index) => {
          const usedCount = usedCardCountMap[card.id] || 0;
          const opacity = usedCount > 0 ? 0.6 : 1;
          const borderRadius = isMobile ? "5px" : "8px";
          const isSelected = selectedCardIds.has(card.id);

          return (
            <Box
              key={`${card.id}-${index}`}
              w={`${CUSTOM_CARD_WIDTH}px`}
              h={`${CUSTOM_CARD_HEIGHT}px`}
              position="relative"
              mr={`-${CUSTOM_CARD_WIDTH / 5}px`}
              mb={4}
              sx={{
                "& div": { borderRadius },
                "& img": { opacity },
                transform: isSelected
                  ? `scale(1.1) translateX(-10px)`
                  : "scale(1)",
                transition: "transform 0.3s ease, box-shadow 0.5s ease",
                borderRadius,
                boxShadow: isSelected ? `0 0 5px 5px ${BLUE_LIGHT}` : "none",
              }}
            >
              <TiltCard
                card={card}
                scale={SCALE}
                used={usedCount > 0}
                onClick={() => {
                  if (inBurn) {
                    onCardSelect?.(card);
                  }
                }}
                onDeck
              />
            </Box>
          );
        })}
      </Flex>
      {filteredCards.length === 0 && (
        <Text color="white" size="l" textAlign="center">
          {t("no-cards")}
        </Text>
      )}
    </Box>
  );
};
