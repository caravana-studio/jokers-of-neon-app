import { Box, Button, Flex } from "@chakra-ui/react";
import { useDeck } from "../../dojo/queries/useDeck";
import { DeckCardsGrid } from "./DeckCardsGrid";
import { preprocessCards } from "./Utils/DeckCardsUtils";
import { SeeSpecialCardsBtn } from "./DeckButtons/SeeSpecialCardsBtn";
import { BackToGameBtn } from "./DeckButtons/BackToGameBtn";
import { DeckFilters } from "./DeckFilters";
import { useDeckFilters } from "../../providers/DeckFilterProvider";
import { DeckHeading } from "./DeckHeading";
import { useStore } from "../../providers/StoreProvider";
import { Card } from "../../types/Card";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { CashSymbol } from "../../components/CashSymbol";

interface DeckPageContentMobileProps {
  inStore?: boolean;
  burn?: boolean;
}

export const DeckPageContentMobile = ({
  inStore = false,
  burn = false,
}: DeckPageContentMobileProps) => {
  const { filterButtonsState } = useDeckFilters();
  const { t } = useTranslation(["game"]);

  const [cardToBurn, setCardToBurn] = useState<Card>();

  const fullDeck = preprocessCards(useDeck()?.fullDeckCards ?? []);
  const usedCards = preprocessCards(useDeck()?.usedCards ?? []);

  const { cash, burnCard, burnItem } = useStore();

  const handleCardSelect = (card: Card) => {
    if (!burnItem.purchased) {
      if (cardToBurn?.id === card.id) {
        setCardToBurn(undefined);
      } else {
        setCardToBurn(card);
      }
    }
  };

  const handleBurnCard = (card: Card) => {
    burnCard(card);
  };

  return (
    <>
      <Flex
        py={4}
        px={{ base: 8, md: 20 }}
        width={"100vw"}
        height={"100vh"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={2}
        flexDirection={"column"}
      >
        <Flex
          alignItems={"center"}
          width={"100%"}
          flexDirection={"column"}
          my={2}
        >
          <DeckHeading />
        </Flex>

        <Flex alignItems={"center"} width={"100%"} overflowY="auto" gap={4}>
          <Box w="100%" height={"100%"}>
            <DeckCardsGrid
              cards={fullDeck}
              usedCards={!inStore ? usedCards : []}
              filters={{
                isNeon: filterButtonsState.isNeon,
                isModifier: filterButtonsState.isModifier,
                suit: filterButtonsState.suit ?? undefined,
              }}
              onCardSelect={burn ? handleCardSelect : () => {}}
              inBurn={burn}
            />
          </Box>
        </Flex>
        <DeckFilters />

        <Flex gap={4} mt={4} wrap={"wrap"} justifyContent={"center"}>
          {burn && (
            <Button
              isDisabled={
                cardToBurn === undefined ||
                cash < burnItem.cost ||
                burnItem.purchased
              }
              onClick={() => {
                if (cardToBurn) handleBurnCard(cardToBurn);
              }}
            >
              {t("game.deck.btns.burn").toUpperCase()}
              {" " + burnItem.cost}
              <CashSymbol />
            </Button>
          )}
          <BackToGameBtn />
        </Flex>
      </Flex>
    </>
  );
};
