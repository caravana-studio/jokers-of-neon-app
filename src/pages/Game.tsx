import { Box, GridItem, Heading, SimpleGrid } from "@chakra-ui/react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { AccountAddress } from "../components/AccountAddress";
import { ActionButton } from "../components/ActionButton";
import { Button } from "../components/Button";
import { ChannelText } from "../components/ChannelText";
import { GameOver } from "../components/GameOver";
import { ModifiableCard } from "../components/ModifiableCard";
import { MultiPoints } from "../components/MultiPoints";
import { TiltCard } from "../components/TiltCard";
import { GAME_ID } from "../constants/localStorage";
import { PLAYS } from "../constants/plays";
import { CARD_WIDTH } from "../constants/visualProps";
import { useDojo } from "../dojo/useDojo";
import { gameExists } from "../dojo/utils/getGame";
import { getRound } from "../dojo/utils/getRound";
import { Plays } from "../enums/plays";
import {
  useGetCurrentHand
} from "../queries/useGetCurrentHand";

export const Game = () => {
  const [gameId, setGameId] = useState<number>(
    Number(localStorage.getItem(GAME_ID)) ?? 0
  );
  const [points, setPoints] = useState(0);
  const [multi, setMulti] = useState(0);

  const {
    data: hand,
    error: gqlError,
    isLoading,
    refetch: refetchHand,
  } = useGetCurrentHand(gameId);

  const queryClient = useQueryClient();

  const resetMultiPoints = () => {
    setPoints(0);
    setMulti(0);
  };

  const {
    setup: {
      systemCalls: { createGame, checkHand, discard, play },
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
    refetchHand();
  };

  const [gameLoading, setGameLoading] = useState(true);
  const [error, setError] = useState(false);

  const [preSelectedCards, setPreSelectedCards] = useState<number[]>([]);

  const [preSelectedPlay, setPreSelectedPlay] = useState<Plays>(Plays.NONE);

  const round = getRound(gameId, Round);
  const score = round?.score ? Number(round?.score) : 0;
  const handsLeft = round?.hands;
  const discardsLeft = round?.discard;

  const executeCreateGame = () => {
    console.log("Creating game...");
    createGame(account.account).then((newGameId) => {
      setGameLoading(false);
      if (newGameId) {
        setGameId(newGameId);
        clearPreSelection();
        localStorage.setItem(GAME_ID, newGameId.toString());
        console.log(`game ${newGameId} created`);
        refreshHand();
      } else {
        setError(true);
      }
    });
  };

  useEffect(() => {
    if (!gameExists(Game, gameId)) {
      executeCreateGame();
    } else {
      setGameLoading(false);
      refreshHand();
      console.log("Game found, no need to create a new one");
    }
  }, []);

  const cardIsPreselected = (cardIndex: number) => {
    return preSelectedCards.filter((idx) => idx === cardIndex).length > 0;
  };

  const unPreSelectCard = (cardIndex: number) => {
    setPreSelectedCards((prev) => {
      return prev.filter((idx) => idx !== cardIndex);
    });
  };

  const preSelectCard = (cardIndex: number) => {
    setPreSelectedCards((prev) => {
      return [...prev, cardIndex];
    });
  };

  const togglePreselected = (cardIndex: number) => {
    if (cardIsPreselected(cardIndex)) {
      unPreSelectCard(cardIndex);
    } else if (preSelectedCards.length < 5) {
      preSelectCard(cardIndex);
    }
  };

  const clearPreSelection = () => {
    resetMultiPoints();
    setPreSelectedCards([]);
  };

  useEffect(() => {
    if (preSelectedCards.length > 0) {
      checkHand(account.account, gameId, preSelectedCards).then((result) => {
        setPreSelectedPlay(result?.play ?? Plays.NONE);
        setMulti(result?.multi ?? 0);
        setPoints(result?.points ?? 0);
      });
    } else {
      setPreSelectedPlay(Plays.NONE);
      resetMultiPoints();
    }
  }, [preSelectedCards]);

  const handleDragEnd = (event: DragEndEvent) => {
    //TODO: Review when we introduce modifiers
    /* const modifiedCard = event.over?.id;
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
    } */
  };

  if (gameLoading) {
    return <div>Loading game...</div>;
  }
  if (error) {
    return <div>Error creating game</div>;
  }

  if (handsLeft === 0) {
    return (
      <GameOver
        score={score}
        onCreateGameClick={() => {
          executeCreateGame();
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        // animation: "5s ease 20000ms normal none infinite running glitch",
      }}
    >
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
          <Box sx={{ height: "30%", p: 10 }}>
            <ChannelText />
            <Box
              sx={{
                position: "fixed",
                display: "flex",
                flexDirection: "column",
                right: 10,
                top: 10,
                gap: 2,
              }}
            >
              <AccountAddress />
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  executeCreateGame();
                }}
              >
                START NEW GAME
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Heading
                className="ui-text"
                sx={{
                  fontSize: 40,
                  mb: 4,
                  color: "white",
                  textShadow: "0 0 20px #fd4bad",
                }}
              >
                SCORE: {score}
              </Heading>
              <Heading className="ui-text" sx={{ fontSize: 25, mb: 2 }}>
                CURRENT PLAY: {PLAYS[preSelectedPlay]}
              </Heading>
              <MultiPoints multi={multi} points={points} />
              {/* {specialCards.map((card) => {
                return (
                  <Box key={card.id} sx={{ mx: 5 }}>
                    <TiltCard card={card} />
                  </Box>
                );
              })} */}
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
                backgroundColor: "rgba(0,0,0,0.7)",
              }}
            >
              <ActionButton
                position="LEFT"
                disabled={
                  preSelectedCards?.length === 0 ||
                  !handsLeft ||
                  handsLeft === 0
                }
                onClick={() => {
                  play(account.account, gameId, preSelectedCards).then(
                    (response) => {
                      if (response) {
                        console.log(response);
                        clearPreSelection();
                        refreshHand();
                      }
                    }
                  );
                }}
                label={["PLAY", "HAND"]}
                secondLabel={`${handsLeft} left`}
              />

              <Box
                sx={{
                  width: `${CARD_WIDTH * 7}px`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  {preSelectedCards.map((idx) => {
                    const card = hand.find((c) => c.idx === idx);
                    return (
                      card && (
                        <Box key={card.id} sx={{ mx: 5 }}>
                          <ModifiableCard id={card.id}>
                            <TiltCard
                              card={card}
                              onClick={() => {
                                togglePreselected(idx);
                              }}
                            />
                          </ModifiableCard>
                        </Box>
                      )
                    );
                  })}
                </Box>
              </Box>
              <ActionButton
                position="RIGHT"
                disabled={
                  preSelectedCards?.length === 0 ||
                  !discardsLeft ||
                  discardsLeft === 0
                }
                onClick={() => {
                  discard(account.account, gameId, preSelectedCards).then(
                    (response) => {
                      if (response) {
                        clearPreSelection();
                        refreshHand();
                      }
                    }
                  );
                }}
                label={["DIS", "CARD"]}
                secondLabel={`${discardsLeft} left`}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                height: " 30%",
                alignItems: "flex-end",
                justifyContent: "center",
                mx: 4,
                pb: 10,
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
                      key={card.img}
                      w="100%"
                      sx={{
                        transform: ` rotate(${
                          (index - 3.5) * 3
                        }deg) translateY(${Math.abs(index - 3.5) * 10}px)`,
                      }}
                    >
                      {!cardIsPreselected(card.idx) && (
                        <TiltCard
                          sx={{
                            ":hover": {
                              transform: "translateY(-30px) ",
                            },
                          }}
                          card={card}
                          onClick={() => {
                            if (!card.isModifier) {
                              togglePreselected(card.idx);
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
        <Heading
          sx={{
            position: "absolute",
            bottom: 7,
            right: 10,
            textAlign: "right",
          }}
        >
          game id: {gameId}
        </Heading>
      </Box>
    </Box>
  );
};
