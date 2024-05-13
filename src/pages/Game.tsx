import { Box, Button, GridItem, Heading, SimpleGrid } from "@chakra-ui/react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { AccountAddress } from "../components/AccountAddress";
import { ModifiableCard } from "../components/ModifiableCard";
import { TiltCard } from "../components/TiltCard";
import { GAME_ID } from "../constants/localStorage";
import { PLAYS } from "../constants/plays";
import { CARD_WIDTH } from "../constants/visualProps";
import { useDojo } from "../dojo/useDojo";
import { getCurrentHandCards } from "../dojo/utils/getCurrentHandCards";
import { gameExists } from "../dojo/utils/getGame";
import { getRound } from "../dojo/utils/getRound";
import { Plays } from "../enums/plays";
import { Card } from "../types/Card";
import { SPECIAL_100, SPECIAL_DOUBLE } from "../utils/getInitialDeck";
import { useCard } from "../dojo/utils/useCard";

export const Game = () => {
  const [gameId, setGameId] = useState<number>(
    Number(localStorage.getItem(GAME_ID)) ?? 0
  );
  const {
    setup: {
      systemCalls: { createGame, checkHand, discard },
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

  const refreshHand = () => {
    console.log("refreshing hand");
    setHand(getCurrentHandCards(gameId, CurrentHandCard));
  };

  const [gameLoading, setGameLoading] = useState(true);
  const [error, setError] = useState(false);

  const [hand, setHand] = useState<Card[]>([]);
  const [preSelectedCards, setPreSelectedCards] = useState<Card[]>([]);
  const [specialCards, setSpecialCards] = useState<Card[]>([
    SPECIAL_DOUBLE,
    SPECIAL_100,
  ]);
  const [preSelectedPlay, setPreSelectedPlay] = useState<Plays>(Plays.NONE);

  const round = getRound(gameId, Round);
  const handsLeft = round?.hands;
  const discardsLeft = round?.discard;

  const card0 = useCard(gameId, 0);
  const card1 = useCard(gameId, 1);
  const card2 = useCard(gameId, 2);
  const card3 = useCard(gameId, 3);
  const card4 = useCard(gameId, 4);
  const card5 = useCard(gameId, 5);
  const card6 = useCard(gameId, 6);
  const card7 = useCard(gameId, 7);

  useEffect(() => {
    console.log("card changed");
    refreshHand()
  }, [card0, card1, card2, card3, card4, card5, card6, card7]);

/*   if (hand.length < 8) {
    setTimeout(() => {
      if (hand.length < 8) {
        refreshHand()
      }
    }, 100)
  } */

  useEffect(() => {
    if (!gameExists(Game, account.account.address, gameId)) {
      console.log("Creating game...");
      createGame(account.account).then((newGameId) => {
        setGameLoading(false);
        if (newGameId) {
          setGameId(newGameId);
          localStorage.setItem(GAME_ID, newGameId.toString());
          refreshHand();
          console.log(`game ${newGameId} created`);
        } else {
          setError(true);
        }
      });
    } else {
      setGameLoading(false);
      refreshHand();
      console.log("Game found, no need to create a new one");
    }
  }, []);

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
      checkHand(account.account, gameId, preSelectedCards).then(
        (play: Plays | undefined) => {
          setPreSelectedPlay(play ?? Plays.NONE);
        }
      );
    } else {
      setPreSelectedPlay(Plays.NONE);
    }
  }, [preSelectedCards]);

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
      <AccountAddress />
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
                    <TiltCard card={card} />
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
                isDisabled={
                  preSelectedCards?.length === 0 ||
                  !handsLeft ||
                  handsLeft === 0
                }
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Box>
                  <Box>
                    PLAY <br /> HAND
                  </Box>
                  <Box sx={{ fontSize: 20, mt: 2 }}>{handsLeft} left</Box>
                </Box>
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
                isDisabled={
                  preSelectedCards?.length === 0 ||
                  !discardsLeft ||
                  discardsLeft === 0
                }
                onClick={(e) => {
                  e.stopPropagation();
                  discard(account.account, gameId, preSelectedCards).then(
                    (response) => {
                      if (response) {
                        clearPreSelection();
                        setTimeout(() => {
                          refreshHand();
                        }, 200);
                      }
                    }
                  );
                }}
              >
                <Box>
                  <Box>
                    DIS <br /> CARD
                  </Box>
                  <Box sx={{ fontSize: 20, mt: 2 }}>{discardsLeft} left</Box>
                </Box>
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
