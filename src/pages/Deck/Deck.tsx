import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useDeckFilters } from "../../providers/DeckFilterProvider";
import { useDeckStore } from "../../state/useDeckStore";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { Card } from "../../types/Card";
import { MobileCoins } from "../store/Coins";
import { DeckCardsGrid } from "./DeckCardsGrid";
import { DeckFilters } from "./Filters/DeckFilters";
import { preprocessCards } from "./Utils/DeckCardsUtils";

interface DeckProps {
  inStore?: boolean;
  burn?: boolean;
  onCardSelect?: (card: Card) => void;
  selectedCards?: Card[];
  inMap?: boolean;
}

export const Deck = ({ inStore, burn, onCardSelect, selectedCards = [], inMap }: DeckProps) => {
  const { t } = useTranslation("game", { keyPrefix: "game.deck" });
  const deck = useDeckStore();
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
          <Flex
            gap={4}
            alignItems="flex-start"
            minWidth="300px"
            width={"auto"}
            zIndex={1}
          >
            <Heading>{t(burn ? "burn-title" : "title")}</Heading>
            <Text
              size="lg"
              color="blueLight"
              pt={1.5}
              fontWeight={500}
              whiteSpace="nowrap"
            >
              {deck && deck.currentLength !== deck.size && !inStore
                ? ` ( ${deck.currentLength} / ${deck.size} )`
                : ` ( ${deck.size} )`}
            </Text>
          </Flex>
        )}
        <Flex alignItems="center" gap={4} flex={1} justifyContent="flex-end">
          <DeckFilters inStore={inStore} />
          {burn && <MobileCoins />}
        </Flex>
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
            usedCards={inStore || inMap ? [] : usedCards}
            filters={{
              isNeon: filterButtonsState.isNeon,
              isModifier: filterButtonsState.isModifier,
              suit: filterButtonsState.suit ?? undefined,
              isFigures: filterButtonsState.isFigures,
              isAces: filterButtonsState.isAces,
            }}
            onCardSelect={burn ? onCardSelect : () => {}}
            selectedCards={selectedCards}
            inBurn={burn}
          />
        </Box>
      </Flex>
    </>
  );
};
