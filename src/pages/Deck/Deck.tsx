import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useDeck } from "../../dojo/queries/useDeck";
import { useDeckFilters } from "../../providers/DeckFilterProvider";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { Card } from "../../types/Card";
import { DeckCardsGrid } from "./DeckCardsGrid";
import { DeckFilters } from "./DeckFilters";
import { preprocessCards } from "./Utils/DeckCardsUtils";

interface DeckProps {
  inStore?: boolean;
  burn?: boolean;
  onCardSelect?: (card: Card) => void;
}

export const Deck = ({ inStore, burn, onCardSelect }: DeckProps) => {
  const { t } = useTranslation("game", { keyPrefix: "game.deck" });
  const deck = useDeck();
  const { filterButtonsState } = useDeckFilters();

  const fullDeck = preprocessCards(deck?.fullDeckCards ?? []);
  const usedCards = preprocessCards(deck?.usedCards ?? []);

  const { isSmallScreen } = useResponsiveValues();

  return (
    <>
      <Flex
        px={[2, "50px"]}
        w="100%"
        justifyContent={isSmallScreen ? "center" : "space-between"}
        gap={4}
      >
        {!isSmallScreen && (
          <Flex gap={4} alignItems="flex-start" minWidth="300px">
            <Heading>{t(burn ? "burn-title" : "title")}</Heading>
            <Text size="lg" color="blueLight" pt={1.5} fontWeight={500}>
              {deck && deck.currentLength !== deck.size && !inStore
                ? ` ( ${deck.currentLength} / ${deck.size} )`
                : ` ( ${deck.size} )`}
            </Text>
          </Flex>
        )}
        <DeckFilters inStore={inStore} />
      </Flex>
      <Flex
        alignItems={"center"}
        width={"100%"}
        h="100%"
        flexGrow={1}
        overflowY="auto"
        gap={4}
        mt={1}
        px={["30px", "50px"]}
      >
        <Box w="100%" height={"100%"}>
          <DeckCardsGrid
            cards={fullDeck}
            usedCards={!inStore ? usedCards : []}
            filters={{
              isNeon: filterButtonsState.isNeon,
              isModifier: filterButtonsState.isModifier,
              suit: filterButtonsState.suit ?? undefined,
              isFigures: filterButtonsState.isFigures,
              isAces: filterButtonsState.isAces,
            }}
            onCardSelect={burn ? onCardSelect : () => {}}
            inBurn={burn}
          />
        </Box>
      </Flex>
    </>
  );
};
