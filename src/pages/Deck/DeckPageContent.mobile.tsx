import { Box, Flex } from "@chakra-ui/react";
import { useDeck } from "../../dojo/queries/useDeck";
import { DeckCardsGrid } from "./DeckCardsGrid";
import { preprocessCards } from "./Utils/DeckCardsUtils";
import { SeeSpecialCardsBtn } from "./DeckButtons/SeeSpecialCardsBtn";
import { BackToGameBtn } from "./DeckButtons/BackToGameBtn";
import { DeckFilters } from "./DeckFilters";
import { useDeckFilters } from "../../providers/DeckFilterProvider";
import { DeckHeading } from "./DeckHeading";

export const DeckPageContentMobile = () => {
  const { filterButtonsState } = useDeckFilters();

  const fullDeck = preprocessCards(useDeck()?.fullDeckCards ?? []);
  const usedCards = preprocessCards(useDeck()?.usedCards ?? []);

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
        flexDirection={"column"}
      >
        <Flex alignItems={"center"} width={"100%"} flexDirection={"column"}>
          <DeckHeading />
          <DeckFilters />
        </Flex>

        <Flex
          alignItems={"center"}
          width={"95%"}
          height={"60%"}
          overflowY="auto"
        >
          <Box w="100%" h="100%">
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

        <Flex gap={4} mt={4} wrap={"wrap"} justifyContent={"center"}>
          <SeeSpecialCardsBtn />
          <BackToGameBtn />
        </Flex>
      </Flex>
    </>
  );
};
