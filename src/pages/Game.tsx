import { Box, Button, GridItem, Heading, SimpleGrid } from "@chakra-ui/react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs/src/types";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useEffect, useState } from "react";
import { ModifiableCard } from "../components/ModifiableCard";
import { TiltCard } from "../components/TiltCard";
import { PLAYS } from "../constants/plays";
import { CARD_WIDTH } from "../constants/visualProps";
import { useDojo } from "../dojo/useDojo";
import { Plays } from "../enums/plays";
import { Card } from "../types/Card";
import {
  SPECIAL_100,
  SPECIAL_DOUBLE,
  getInitialDeck,
} from "../utils/getInitialDeck";

let deck = getInitialDeck();

export const Game = () => {
  const {
    setup: {
      systemCalls: { createGame, checkHand },
      clientComponents: {
        Card,
        PokerHandEvent,
        CurrentSpecialCards,
        Game,
        PlayerModifierCards,
        PlayerSpecialCards,
        CurrentHandCard,
        DeckCard,
        Round,
      },
    },
    account,
  } = useDojo();

  // entity id we are syncing
  const entityId = getEntityIdFromKeys([
    BigInt(account?.account.address),
  ]) as Entity;

  console.log("entityId", entityId);

  // get current component values
  const currentHand = useComponentValue(CurrentHandCard, entityId);
  const game = useComponentValue(Game, entityId);
  const card = useComponentValue(Card, entityId);
  const pokerHandEvent = useComponentValue(PokerHandEvent, entityId);
  const currentSpecialCards = useComponentValue(CurrentSpecialCards, entityId);
  const playerModifierCards = useComponentValue(PlayerModifierCards, entityId);
  const playerSpecialCards = useComponentValue(PlayerSpecialCards, entityId);
  const deck2 = useComponentValue(DeckCard, entityId);
  const round = useComponentValue(Round, entityId);
  console.log("currentHand", currentHand);
  console.log("game", game);
  console.log("card", card);
  console.log("pokerHandEvent", pokerHandEvent);
  console.log("currentSpecialCards", currentSpecialCards);
  console.log("playerModifierCards", playerModifierCards);
  console.log("playerSpecialCards", playerSpecialCards);
  console.log("deck", deck2);
  console.log("round", round);
  /*   console.log(CurrentHand.values);
  console.log(CurrentHand.metadata);
  console.log(CurrentHand.entities); */

  const [gameLoading, setGameLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    createGame(account.account).then((response) => {
      setGameLoading(false);
      console.log("sresponse", response);
      if (!response) {
        setError(true);
      }
    });
  }, []);

  const [hand, setHand] = useState<Card[]>([]);
  const [preSelectedCards, setPreSelectedCards] = useState<Card[]>([]);
  const [specialCards, setSpecialCards] = useState<Card[]>([
    SPECIAL_DOUBLE,
    SPECIAL_100,
  ]);
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
    console.log("pre");
    if (preSelectedCards.length < 5 || hand[cardIndex].preSelected) {
      console.log("in");
      const nextHand = hand.map((card, i) => {
        if (i === cardIndex) {
          console.log("doublein", card.preSelected);
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

  const unPreSelectCard = (card: Card) => {
    const { id } = card;
    console.log("unpreselecting", card);
    setPreSelectedCards(preSelectedCards.filter((card) => card.id !== id));
    card.modifiers?.forEach((modifier) => {
      console.log(
        "mod",
        hand.findIndex((card) => card.id === modifier.id)
      );
      togglePreselected(hand.findIndex((card) => card.id === modifier.id));
    });
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
  if (error) {
    return <div>Error creating game</div>;
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
          <Box sx={{ height: "30%" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              {specialCards.map((card) => {
                return (
                  <Box key={card.id} sx={{ mx: 5 }}>
                    <TiltCard
                      card={card}
                    />
                  </Box>
                );
              })}
            </Box>
          </Box>
          <DndContext onDragEnd={handleDragEnd}>
            <Box
              sx={{
                height: "40%",
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button
                sx={{
                  borderRadius: 2000,
                  height: 300,
                  width: 300,
                  ml: -180,
                  pl: 150,
                  fontSize: 35,
                }}
                isDisabled={preSelectedCards?.length === 0}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                PLAY <br /> HAND
              </Button>
              <Box
                sx={{
                  width: `${CARD_WIDTH * 7}px`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <Heading sx={{ fontSize: 25 }}>
                  CURRENT PLAY: {PLAYS[preSelectedPlay]}
                </Heading>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  {preSelectedCards.map((card) => {
                    return (
                      <Box key={card.id} sx={{ mx: 5 }}>
                        <ModifiableCard id={card.id}>
                          <TiltCard
                            card={card}
                            onClick={() => {
                              unPreSelectCard(card);
                            }}
                          />
                        </ModifiableCard>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
              <Button
                sx={{
                  borderRadius: 2000,
                  height: 300,
                  width: 300,
                  mr: -180,
                  pr: 150,
                  fontSize: 35,
                  textAlign: "right",
                }}
                isDisabled={preSelectedCards?.length === 0}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                DIS <br />
                CARD
              </Button>
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
                  minWidth: `${CARD_WIDTH * 4}px`,
                  maxWidth: `${CARD_WIDTH * 6.5}px`,
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
