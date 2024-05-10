import { Box, Button, GridItem, Heading, SimpleGrid } from "@chakra-ui/react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { ModifiableCard } from "../components/ModifiableCard";
import { TiltCard } from "../components/TiltCard";
import { PLAYS } from "../constants/plays";
import { CARD_WIDTH } from "../constants/visualProps";
import { useDojo } from "../dojo/useDojo";
import { Plays } from "../enums/plays";
import { Card } from "../types/Card";
import { getInitialDeck } from "../utils/getInitialDeck";

let deck = getInitialDeck();

export const Game = () => {
  const {
    setup: {
      systemCalls: { createGame, checkHand },
      clientComponents: { Card, PokerHandEvent, Game },
    },
    account,
  } = useDojo();

  const [gameLoading, setGameLoading] = useState(true);

  useEffect(() => {
    createGame(account.account).then(() => {
      setGameLoading(false);
    });
  }, []);

  const [hand, setHand] = useState<Card[]>([]);
  const [preSelectedCards, setPreSelectedCards] = useState<Card[]>([]);
  const [preSelectedPlay, setPreSelectedPlay] = useState<Plays>(Plays.NONE);

  const drawCard = () => {
    const newCard = deck.pop();
    if (newCard) {
      setHand((prevHand) => {
        return prevHand.length < 8
          ? [...prevHand, { ...newCard, preSelected: false }]
          : prevHand;
      });
    }
  };

  const togglePreselected = (cardIndex: number) => {
    if (preSelectedCards.length < 5 || hand[cardIndex].preSelected) {
      const nextHand = hand.map((card, i) => {
        if (i === cardIndex) {
          return { ...card, preSelected: !card.preSelected };
        } else {
          return card;
        }
      });
      setHand(nextHand);
    }
  };

  const preSelectCard = (cardIndex: number) => {
    if (preSelectedCards.length < 5) {
      const movingCard = hand[cardIndex];
      setPreSelectedCards([...preSelectedCards, movingCard]);
    }
    togglePreselected(cardIndex);
  };

  const clearPreSelection = () => {
    const nextHand = hand.map((card) => {
      return { ...card, preSelected: false };
    });
    setHand(nextHand);
    setPreSelectedCards([]);
  };

  const unPreSelectCard = (id: string) => {
    setPreSelectedCards(preSelectedCards.filter((card) => card.id !== id));
    togglePreselected(hand.findIndex((card) => card.id === id));
  };

  useEffect(() => {
    if (preSelectedCards.length > 0) {
      checkHand(account.account, preSelectedCards).then(
        (play: Plays | undefined) => {
          setPreSelectedPlay(play ?? Plays.NONE);
        }
      );
    } else {
      setPreSelectedPlay(Plays.NONE);
    }
  }, [preSelectedCards]);

  useEffect(() => {
    Array.from(Array(8)).forEach(() => {
      drawCard();
    });
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    console.log(event);
    const modifiedCard = event.over?.id;
    const modifier = event.active?.id;
    if (modifiedCard && modifier) {
      const handModifier = hand.find(
        (handModifier) => handModifier.id === modifier
      );
      if (handModifier) {
        const nextPreselectedCards = preSelectedCards.map((card) => {
          if (card.id === modifiedCard) {
            return {
              ...card,
              modifiers: [...(card.modifiers ?? []), handModifier],
            };
          } else {
            return card;
          }
        });
        setPreSelectedCards(nextPreselectedCards);
        togglePreselected(
          hand.findIndex((handCard) => handCard.id === modifier)
        );
      }
    }
  };

  if (gameLoading) {
    return <div>Loading game...</div>;
  }

  return (
    <Box
      sx={{
        height: "100%",
        // animation: "5s ease 20000ms normal none infinite running glitch",
      }}
    >
      <div className="text strk">
        <span>$STRK</span>
      </div>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          filter: "blur(0.7px)",
          animation: "jerkup-mild 100ms infinite",
        }}
        onClick={clearPreSelection}
      >
        <Box sx={{ width: "100%", height: "100%" }}>
          <Box sx={{ height: "30%" }}></Box>
          <DndContext onDragEnd={handleDragEnd}>
            <Box sx={{ height: "40%", mx: 35 }}>
              <SimpleGrid columns={5} gap={4}>
                <GridItem colSpan={4}>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    {preSelectedCards.map((card) => {
                      return (
                        <Box key={card.id} sx={{ width: "20%", mx: 4 }}>
                          <ModifiableCard id={card.id}>
                            <TiltCard
                              card={card}
                              onClick={() => {
                                unPreSelectCard(card.id);
                              }}
                            />
                          </ModifiableCard>
                        </Box>
                      );
                    })}
                  </Box>
                </GridItem>
                <GridItem>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    <Heading>CURRENT PLAY: {PLAYS[preSelectedPlay]}</Heading>
                    <Button
                      className="fullWidth"
                      isDisabled={preSelectedCards?.length === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      play hand
                    </Button>
                    <Button
                      className="fullWidth"
                      isDisabled={preSelectedCards?.length === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      discard
                    </Button>
                  </Box>
                </GridItem>
              </SimpleGrid>
            </Box>
            <Box
              sx={{
                display: "flex",
                height: " 30%",
                alignItems: "flex-end",
                justifyContent: "center",
                mx: 4,
              }}
            >
              <SimpleGrid
                sx={{
                  minWidth: `${CARD_WIDTH * 5}px`,
                  maxWidth: `${CARD_WIDTH * 7}px`,
                }}
                columns={8}
              >
                {hand.map((card, index) => {
                  return (
                    <GridItem
                      key={card.id}
                      w="100%"
                      sx={{
                        transform: ` rotate(${
                          (index - 3.5) * 3
                        }deg) translateY(${Math.abs(index - 3.5) * 10}px)`,
                      }}
                    >
                      {!card.preSelected && (
                        <TiltCard
                          sx={{
                            ":hover": {
                              transform: "translateY(-30px) ",
                            },
                          }}
                          card={card}
                          onClick={() => {
                            if (!card.isModifier) {
                              preSelectCard(index);
                            }
                          }}
                        />
                      )}
                    </GridItem>
                  );
                })}
              </SimpleGrid>
            </Box>
          </DndContext>
        </Box>
      </Box>
    </Box>
  );
};
