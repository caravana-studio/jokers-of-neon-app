import { Box, Button, Flex, Tab, TabList, Tabs } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { CashSymbol } from "../../components/CashSymbol";
import { MobileBottomBar } from "../../components/MobileBottomBar";
import { MobileDecoration } from "../../components/MobileDecoration";
import { useDeck } from "../../dojo/queries/useDeck";
import { useDeckFilters } from "../../providers/DeckFilterProvider";
import { useStore } from "../../providers/StoreProvider";
import { Card } from "../../types/Card";
import { PlaysAvailableTable } from "../Plays/PlaysAvailableTable";
import { BackToGameBtn } from "./DeckButtons/BackToGameBtn";
import { DeckCardsGrid } from "./DeckCardsGrid";
import { DeckFilters } from "./DeckFilters";
import { preprocessCards } from "./Utils/DeckCardsUtils";

interface DeckPageContentMobileProps {
  inStore?: boolean;
  burn?: boolean;
}

export const DeckPageContentMobile = ({
  inStore = false,
  burn = false,
}: DeckPageContentMobileProps) => {
  const { filterButtonsState } = useDeckFilters();
  const { t } = useTranslation("game", { keyPrefix: "game.deck.tabs" });
  const [cardToBurn, setCardToBurn] = useState<Card>();

  const fullDeck = preprocessCards(useDeck()?.fullDeckCards ?? []);
  const usedCards = preprocessCards(useDeck()?.usedCards ?? []);
  const [tabIndex, setTabIndex] = useState(0);

  // Handle tab change
  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };
  const navigate = useNavigate();

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (tabIndex < 1) setTabIndex(tabIndex + 1);
    },
    onSwipedRight: () => {
      if (tabIndex === 0) {
        navigate("/demo");
      } else if (tabIndex > 0) {
        setTabIndex(tabIndex - 1);
      }
    },
    trackTouch: true,
  });

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

  const effectiveCost: number =
    burnItem?.discount_cost && burnItem.discount_cost !== 0
      ? Number(burnItem.discount_cost)
      : Number(burnItem.cost);

  return (
    <>
      <Flex
        px={{ base: 0, md: 20 }}
        mt={4}
        pb={3}
        width={"100%"}
        height={"100%"}
        alignItems={"center"}
        justifyContent={"space-between"}
        gap={2}
        flexDirection={"column"}
        {...handlers}
      >
        <MobileDecoration />
        <Flex
          alignItems={"center"}
          width={"100%"}
          flexDirection={"column"}
          my={2}
          px={4}
        >
          <Tabs
            index={tabIndex}
            onChange={handleTabChange}
            w="100%"
            isFitted
            color="white"
            mt={2}
          >
            <TabList>
              <Tab fontSize={12}>{t("full-deck")}</Tab>
              <Tab fontSize={12}>{t("plays")}</Tab>
            </TabList>
          </Tabs>
        </Flex>

        {tabIndex === 0 && (
          <>
            <DeckFilters />
            <Flex
              alignItems={"center"}
              width={"100%"}
              flexGrow={1}
              overflowY="auto"
              gap={4}
              mt={1}
              px={6}
            >
              <Box w="100%" height={"100%"}>
                <DeckCardsGrid
                  cards={fullDeck}
                  usedCards={usedCards}
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
          </>
        )}

        {tabIndex === 1 && (
          <PlaysAvailableTable maxHeight={{ base: "80%", lg: "60%" }} />
        )}
        <MobileBottomBar
          firstButton={
            burn ? (
              <Button
                isDisabled={
                  cardToBurn === undefined ||
                  cash < effectiveCost ||
                  burnItem.purchased
                }
                onClick={() => {
                  if (cardToBurn) handleBurnCard(cardToBurn);
                }}
              >
                {t("game.deck.btns.burn").toUpperCase()}
                {" " + effectiveCost}
                <CashSymbol />
              </Button>
            ) : (
              <></>
            )
          }
          secondButton={<BackToGameBtn />}
          hideDeckButton
        />
      </Flex>
    </>
  );
};
