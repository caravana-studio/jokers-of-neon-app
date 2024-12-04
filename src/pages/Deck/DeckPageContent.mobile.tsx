import { Box, Flex, Tab, TabList, Tabs } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { useDeck } from "../../dojo/queries/useDeck";
import { useDeckFilters } from "../../providers/DeckFilterProvider";
import { PlaysAvailableTable } from "../Plays/PlaysAvailableTable";
import { BackToGameBtn } from "./DeckButtons/BackToGameBtn";
import { DeckCardsGrid } from "./DeckCardsGrid";
import { DeckFilters } from "./DeckFilters";
import { preprocessCards } from "./Utils/DeckCardsUtils";
import { useTranslation } from "react-i18next";

export const DeckPageContentMobile = () => {
  const { filterButtonsState } = useDeckFilters();
  const { t } = useTranslation("game", { keyPrefix: "game.deck.tabs" });

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

  return (
    <>
      <Flex
        py={4}
        px={{ base: 8, md: 20 }}
        width={"100%"}
        height={"100%"}
        alignItems={"center"}
        justifyContent={"space-between"}
        gap={2}
        flexDirection={"column"}
        {...handlers}
      >
        <Flex
          alignItems={"center"}
          width={"100%"}
          flexDirection={"column"}
          my={2}
        >
          <Tabs
            index={tabIndex}
            onChange={handleTabChange}
            w="100%"
            isFitted
            color="white"
          >
            <TabList>
              <Tab>{t("full-deck")}</Tab>
              <Tab>{t("plays")}</Tab>
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
                />
              </Box>
            </Flex>
          </>
        )}

        {tabIndex === 1 && (
          <PlaysAvailableTable maxHeight={{ base: "80%", lg: "60%" }} />
        )}

        <Flex gap={4} mt={4} wrap={"wrap"} justifyContent={"center"}>
          <BackToGameBtn />
        </Flex>
      </Flex>
    </>
  );
};
