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

interface DeckPageContentProps {
  inStore?: boolean;
}

export const DeckPageContent = ({ inStore = false }: DeckPageContentProps) => {
  const { filterButtonsState } = useDeckFilters();
  const { t } = useTranslation(["game"]);
  const navigate = useNavigate();

  const [cardToBurn, setCardToBurn] = useState<Card>();

  const fullDeck = preprocessCards(useDeck()?.fullDeckCards ?? []);
  const usedCards = preprocessCards(useDeck()?.usedCards ?? []);

  const handleCardSelect = (card: Card) => {
    if (cardToBurn?.id === card.id) {
      setCardToBurn(undefined);
    } else {
      setCardToBurn(card);
    }
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
            <Button onClick={() => navigate(-1)}>
              {t("game.deck.btns.burn").toUpperCase()}
            </Button>
            <BackToGameBtn />
          </Flex>
        </Flex>
        <Flex
          alignItems={"center"}
          width={"55%"}
          height={"60%"}
          overflowY="auto"
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
              onCardSelect={handleCardSelect}
            />
          </Box>
        </Flex>
      </Flex>
    </>
  );
};
