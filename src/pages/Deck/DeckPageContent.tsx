import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useDeck } from "../../dojo/queries/useDeck";
import { DeckCardsFilters, DeckCardsGrid } from "./DeckCardsGrid";
import { BLUE_LIGHT } from "../../theme/colors";
import { useState } from "react";
import { Suits } from "../../enums/suits";
import { DeckFiltersMap, preprocessCards } from "./Utils/DeckCardsUtils";
import { useTranslation } from "react-i18next";
import { SeeSpecialCardsBtn } from "./DeckButtons/SeeSpecialCardsBtn";
import { BackToGameBtn } from "./DeckButtons/BackToGameBtn";

export const DeckPageContent = () => {
  const { t } = useTranslation(["game"]);

  const fullDeck = preprocessCards(useDeck()?.fullDeckCards ?? []);
  const usedCards = preprocessCards(useDeck()?.usedCards ?? []);

  const [filterButtonsState, setFilterButtonsState] = useState<DeckFiltersMap>({
    isNeon: undefined,
    isModifier: undefined,
    suit: null,
  });

  const updateFilters = (newFilters: DeckCardsFilters) => {
    setFilterButtonsState((prevState) => ({
      isNeon: newFilters.isNeon !== undefined ? newFilters.isNeon : undefined,
      isModifier:
        newFilters.isModifier !== undefined ? newFilters.isModifier : undefined,
      suit: newFilters.suit !== undefined ? newFilters.suit : null,
    }));
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
          <Flex flexDirection={"column"} my={12} alignItems={"center"}>
            <Text
              size={"sm"}
              sx={{
                position: "relative",
                _before: {
                  content: '""',
                  position: "absolute",
                  bottom: "0px",
                  left: 0,
                  width: "100%",
                  height: "1px",
                  background: `linear-gradient(to right, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.5) 100%)`,
                  boxShadow:
                    "0 0 10px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.5)",
                },
              }}
            >
              {t("game.deck.filter-title")}
            </Text>
            <Flex
              alignItems={"space-around"}
              justifyContent={"center"}
              wrap={"wrap"}
              gap={4}
              mt={8}
              width={"95%"}
            >
              <Button
                size={"sm"}
                variant={
                  filterButtonsState.suit === Suits.CLUBS
                    ? "outlineSecondaryGlowActive"
                    : "outlineSecondaryGlow"
                }
                borderRadius={"25px"}
                onClick={() =>
                  updateFilters({
                    suit:
                      filterButtonsState.suit !== Suits.CLUBS
                        ? Suits.CLUBS
                        : undefined,
                  })
                }
              >
                {t("game.deck.suit.club").toUpperCase()}
              </Button>
              <Button
                size={"sm"}
                variant={
                  filterButtonsState.suit === Suits.SPADES
                    ? "outlineSecondaryGlowActive"
                    : "outlineSecondaryGlow"
                }
                borderRadius={"25px"}
                onClick={() =>
                  updateFilters({
                    suit:
                      filterButtonsState.suit !== Suits.SPADES
                        ? Suits.SPADES
                        : undefined,
                  })
                }
              >
                {t("game.deck.suit.spade").toUpperCase()}
              </Button>
              <Button
                size={"sm"}
                variant={
                  filterButtonsState.suit === Suits.HEARTS
                    ? "outlineSecondaryGlowActive"
                    : "outlineSecondaryGlow"
                }
                borderRadius={"25px"}
                onClick={() =>
                  updateFilters({
                    suit:
                      filterButtonsState.suit !== Suits.HEARTS
                        ? Suits.HEARTS
                        : undefined,
                  })
                }
              >
                {t("game.deck.suit.heart").toUpperCase()}
              </Button>
              <Button
                size={"sm"}
                variant={
                  filterButtonsState.suit === Suits.DIAMONDS
                    ? "outlineSecondaryGlowActive"
                    : "outlineSecondaryGlow"
                }
                borderRadius={"25px"}
                onClick={() =>
                  updateFilters({
                    suit:
                      filterButtonsState.suit !== Suits.DIAMONDS
                        ? Suits.DIAMONDS
                        : undefined,
                  })
                }
              >
                {t("game.deck.suit.diamond").toUpperCase()}
              </Button>
              <Button
                size={"sm"}
                variant={
                  filterButtonsState.isNeon
                    ? "outlineSecondaryGlowActive"
                    : "outlineSecondaryGlow"
                }
                borderRadius={"25px"}
                onClick={() =>
                  updateFilters({
                    isNeon: !filterButtonsState.isNeon ? true : undefined,
                  })
                }
              >
                {t("game.deck.suit.neon").toUpperCase()}
              </Button>
              <Button
                size={"sm"}
                variant={
                  filterButtonsState.isModifier
                    ? "outlineSecondaryGlowActive"
                    : "outlineSecondaryGlow"
                }
                borderRadius={"25px"}
                onClick={() =>
                  updateFilters({
                    isModifier: !filterButtonsState.isModifier
                      ? true
                      : undefined,
                  })
                }
              >
                {t("game.deck.suit.modifier").toUpperCase()}
              </Button>
            </Flex>
          </Flex>

          <Flex
            gap={4}
            mt={{ base: 4, md: 20 }}
            wrap={{ base: "wrap", md: "nowrap" }}
            justifyContent={"center"}
          >
            <SeeSpecialCardsBtn />
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
              usedCards={usedCards}
              filters={{
                isNeon: filterButtonsState.isNeon ?? undefined,
                isModifier: filterButtonsState.isModifier ?? undefined,
                suit: filterButtonsState.suit ?? undefined,
              }}
            />
          </Box>
        </Flex>
      </Flex>
    </>
  );
};
