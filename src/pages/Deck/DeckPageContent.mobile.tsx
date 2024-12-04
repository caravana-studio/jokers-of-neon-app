import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useDeck } from "../../dojo/queries/useDeck";
import { useDeckFilters } from "../../providers/DeckFilterProvider";
import { BackToGameBtn } from "./DeckButtons/BackToGameBtn";
import { DeckCardsGrid } from "./DeckCardsGrid";
import { DeckFilters } from "./DeckFilters";
import { preprocessCards } from "./Utils/DeckCardsUtils";

export const DeckPageContentMobile = () => {
  const { filterButtonsState } = useDeckFilters();

  const fullDeck = preprocessCards(useDeck()?.fullDeckCards ?? []);
  const usedCards = preprocessCards(useDeck()?.usedCards ?? []);

  return (
    <>
      <Flex
        py={4}
        px={{ base: 8, md: 20 }}
        width={"100%"}
        height={"100%"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={2}
        flexDirection={"column"}
      >
        <Tabs w="100%" isFitted color="white">
          <TabList>
            <Tab>FULL DECK</Tab>
            <Tab>PLAYS</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Flex
                alignItems={"center"}
                width={"100%"}
                overflowY="auto"
                gap={4}
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
              <DeckFilters />
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Flex gap={4} mt={4} wrap={"wrap"} justifyContent={"center"}>
          <BackToGameBtn />
        </Flex>
      </Flex>
    </>
  );
};
