import { Box, Flex, Heading } from "@chakra-ui/react";
import { useDeck } from "../../dojo/queries/useDeck";
import { DeckCardsGrid } from "./DeckCardsGrid";
import { BLUE_LIGHT } from "../../theme/colors";
import { preprocessCards } from "./Utils/DeckCardsUtils";
import { useTranslation } from "react-i18next";
import { SeeSpecialCardsBtn } from "./DeckButtons/SeeSpecialCardsBtn";
import { BackToGameBtn } from "./DeckButtons/BackToGameBtn";
import { DeckFilters } from "./DeckFilters";
import { useDeckFilters } from "../../providers/DeckFilterProvider";

export const DeckPageContentMobile = () => {
  const { t } = useTranslation(["game"]);
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
          <Heading
            variant="italic"
            size="l"
            width={"100%"}
            ml={4}
            textAlign={"center"}
            sx={{
              position: "relative",
              _after: {
                content: '""',
                position: "absolute",
                top: "-12px",
                left: 0,
                width: "100%",
                height: "1px",
                background: `linear-gradient(to right, rgba(255, 255, 255, 0) 0%, ${BLUE_LIGHT} 50%, rgba(255, 255, 255, 0) 100%)`,
                boxShadow:
                  "0 0 10px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.5)",
              },
              _before: {
                content: '""',
                position: "absolute",
                bottom: "-12px",
                left: 0,
                width: "100%",
                height: "1px",
                background: `linear-gradient(to right, rgba(255, 255, 255, 0) 0%, ${BLUE_LIGHT} 50%, rgba(255, 255, 255, 0) 100%)`,
                boxShadow:
                  "0 0 10px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.5)",
              },
            }}
          >
            {t("game.deck.title")}
          </Heading>
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
