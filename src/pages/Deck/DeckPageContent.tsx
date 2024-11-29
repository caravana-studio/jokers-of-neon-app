import { Box, Button, Flex } from "@chakra-ui/react";
import { useDeck } from "../../dojo/queries/useDeck";
import { DeckCardsGrid } from "./DeckCardsGrid";
import { preprocessCards } from "./Utils/DeckCardsUtils";
import { SeeSpecialCardsBtn } from "./DeckButtons/SeeSpecialCardsBtn";
import { BackToGameBtn } from "./DeckButtons/BackToGameBtn";
import { DeckFilters } from "./DeckFilters";
import { useDeckFilters } from "../../providers/DeckFilterProvider";
import { DeckHeading } from "./DeckHeading";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card } from "../../types/Card";
import { useStore } from "../../providers/StoreProvider";
import { CashSymbol } from "../../components/CashSymbol";

interface DeckPageContentProps {
  inStore?: boolean;
  burn?: boolean;
}

export const DeckPageContent = ({
  inStore = false,
  burn = false,
}: DeckPageContentProps) => {
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
    setCardToBurn(undefined);
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
        gap={12}
      >
        <Flex
          alignItems={"center"}
          width={"45%"}
          height={"50%"}
          flexDirection={"column"}
        >
          <DeckHeading />
          <Flex my={12}>
            <DeckFilters />
          </Flex>

          <Flex
            gap={4}
            mt={{ base: 4, md: 20 }}
            wrap={{ base: "wrap", md: "nowrap" }}
            justifyContent={"center"}
          >
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
                {t("game.deck.btns.burn").toUpperCase()} {" " + burnItem.cost}
                <CashSymbol />
              </Button>
            )}
            <BackToGameBtn />
          </Flex>
        </Flex>
        <Flex
          alignItems={"center"}
          width={"55%"}
          height={"60%"}
          overflowY="auto"
          paddingTop={"25px"}
        >
          <Box w="100%" h="100%">
            <DeckCardsGrid
              cards={fullDeck}
              usedCards={!inStore ? usedCards : []}
              filters={{
                isNeon: filterButtonsState.isNeon ?? undefined,
                isModifier: filterButtonsState.isModifier ?? undefined,
                suit: filterButtonsState.suit ?? undefined,
              }}
              onCardSelect={burn ? handleCardSelect : () => {}}
              inBurn={burn}
            />
          </Box>
        </Flex>
      </Flex>
    </>
  );
};
