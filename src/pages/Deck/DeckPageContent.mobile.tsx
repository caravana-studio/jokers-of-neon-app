import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useCurrentDeck, useFullDeck } from "../../dojo/queries/useDeck";
import { DeckCardsFilters, DeckCardsGrid } from "./DeckCardsGrid";
import { BLUE_LIGHT } from "../../theme/colors";
import { useState } from "react";
import { Suits } from "../../enums/suits";
import { useNavigate } from "react-router-dom";
import { CurrentSpecialCardsModal } from "../../components/CurrentSpecialCardsModal";
import { createUsedCardsList, preprocessCards } from "./Utils/DeckCardsUtils";

interface DeckFiltersMap {
    isNeon: boolean | undefined;
    isModifier: boolean | undefined;
    suit: Suits | null;
  }

export const DeckPageContentMobile = () => 
    {
        const fullDeck = preprocessCards(useFullDeck()?.cards ?? []);
        const currentDeck = preprocessCards(useCurrentDeck()?.cards ?? []);
        const usedCards = createUsedCardsList(fullDeck ?? [], currentDeck ?? []);

        const navigate = useNavigate();
        const [specialCardsModalOpen, setSpecialCardsModalOpen] = useState(false);
        const [filterButtonsState, setFilterButtonsState] = useState<DeckFiltersMap>({
            isNeon: undefined,
            isModifier: undefined,
            suit: null,
          });

        const updateFilters = (newFilters: DeckCardsFilters) =>
        {
            setFilterButtonsState((prevState) => ({
                isNeon: newFilters.isNeon !== undefined ? newFilters.isNeon : undefined,
                isModifier: newFilters.isModifier !== undefined ? newFilters.isModifier : undefined,
                suit: newFilters.suit !== undefined ? newFilters.suit : null,
              }));
        };

        return(
            <>
                {specialCardsModalOpen && (
                    <CurrentSpecialCardsModal
                    close={() => setSpecialCardsModalOpen(false)}
                    />
                )}
                <Flex py={4} px={{base: 8, md: 20}} width={"100vw"} height={"100vh"} alignItems={"center"} justifyContent={"center"} gap={12} flexDirection={"column"}>
                    <Flex alignItems={"center"}  width={"100%"} flexDirection={"column"}>
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
                                    background:
                                        `linear-gradient(to right, rgba(255, 255, 255, 0) 0%, ${BLUE_LIGHT} 50%, rgba(255, 255, 255, 0) 100%)`,
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
                                    background:
                                        `linear-gradient(to right, rgba(255, 255, 255, 0) 0%, ${BLUE_LIGHT} 50%, rgba(255, 255, 255, 0) 100%)`,
                                    boxShadow:
                                        "0 0 10px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.5)",
                                },
                            }}
                        >
                            My full deck
                        </Heading>
                        <Flex flexDirection={"column"} my={2} alignItems={"center"}>
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
                                        background:
                                            `linear-gradient(to right, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.5) 100%)`,
                                        boxShadow:
                                            "0 0 10px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.5)",
                                    },
                                }}
                            >
                                Filter by
                            </Text>
                            <Flex alignItems={"space-around"} justifyContent={"center"} wrap={"wrap"} gap={4} mt={8} width={"95%"}>
                            <Button
                                    size={"sm"}
                                    variant={ filterButtonsState.suit === Suits.CLUBS ? "outlineSecondaryGlowActive" : "outlineSecondaryGlow"}
                                    borderRadius={"25px"}
                                    onClick={() => updateFilters({suit: filterButtonsState.suit !== Suits.CLUBS ? Suits.CLUBS : undefined})}
                                >
                                    CLUB
                                </Button>
                                <Button
                                    size={"sm"}
                                    variant={ filterButtonsState.suit === Suits.SPADES ? "outlineSecondaryGlowActive" : "outlineSecondaryGlow"}
                                    borderRadius={"25px"}
                                    onClick={() => updateFilters({suit: filterButtonsState.suit !== Suits.SPADES ? Suits.SPADES : undefined})}
                                >
                                    SPADE
                                </Button>
                                <Button
                                    size={"sm"}
                                    variant={ filterButtonsState.suit === Suits.HEARTS ? "outlineSecondaryGlowActive" : "outlineSecondaryGlow"}
                                    borderRadius={"25px"}
                                    onClick={() => updateFilters({suit: filterButtonsState.suit !== Suits.HEARTS ? Suits.HEARTS : undefined})}
                                >
                                    HEART
                                </Button>
                                <Button
                                    size={"sm"}
                                    variant={ filterButtonsState.suit === Suits.DIAMONDS ? "outlineSecondaryGlowActive" : "outlineSecondaryGlow"}
                                    borderRadius={"25px"}
                                    onClick={() => updateFilters({suit: filterButtonsState.suit !== Suits.DIAMONDS ? Suits.DIAMONDS : undefined})}
                                >
                                    DIAMOND
                                </Button>
                                <Button
                                    size={"sm"}
                                    variant={ filterButtonsState.isNeon ? "outlineSecondaryGlowActive" : "outlineSecondaryGlow"}
                                    borderRadius={"25px"}
                                    onClick={() => updateFilters({isNeon: !filterButtonsState.isNeon ? true : undefined})}
                                >
                                    NEON
                                </Button>
                                <Button
                                    size={"sm"}
                                    variant={ filterButtonsState.isModifier ? "outlineSecondaryGlowActive" : "outlineSecondaryGlow"}
                                    borderRadius={"25px"}
                                    onClick={() => updateFilters({isModifier: !filterButtonsState.isModifier ? true : undefined})}
                                >
                                    MODIFIER
                                </Button>
                            </Flex>
                        </Flex>
                    </Flex>

                    <Flex alignItems={"center"} width={"95%"} height={"60%"} overflowY="auto">
                        <Box w="100%" h="100%"> 
                            <DeckCardsGrid
                                cards={fullDeck}
                                usedCards={usedCards}
                                filters={{
                                    isNeon: filterButtonsState.isNeon,
                                    isModifier: filterButtonsState.isModifier,
                                    suit: filterButtonsState.suit ?? undefined
                                 }} 
                            />
                        </Box>
                    </Flex>

                    <Flex gap={4} mt={4} wrap={"wrap"} justifyContent={"center"}>
                            <Button
                                variant={"outlinePrimaryGlow"}
                                onClick={() => {
                                    setSpecialCardsModalOpen(true);
                                }}
                            >
                                SEE SPECIAL CARDS
                            </Button>
                            <Button 
                                variant={"outlinePrimaryGlow"} 
                                onClick={() => navigate("/demo")}
                            >
                                BACK TO GAME
                            </Button>
                        </Flex>
                </Flex>
            </>
        );
    }