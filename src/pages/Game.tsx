import { Box, GridItem, Heading, SimpleGrid } from "@chakra-ui/react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccountAddress } from "../components/AccountAddress";
import { ActionButton } from "../components/ActionButton";
import { AnimatedCard } from "../components/AnimatedCard";
import { Button } from "../components/Button";
import { ChannelText } from "../components/ChannelText";
import { ModifiableCard } from "../components/ModifiableCard";
import { MultiPoints } from "../components/MultiPoints";
import { RollingNumber } from "../components/RollingNumber";
import { TiltCard } from "../components/TiltCard";
import { GAME_ID } from "../constants/localStorage";
import { PLAYS } from "../constants/plays";
import { CARD_WIDTH } from "../constants/visualProps";
import { useDojo } from "../dojo/useDojo";
import { gameExists } from "../dojo/utils/getGame";
import { Plays } from "../enums/plays";
import { useGetCurrentHand } from "../queries/useGetCurrentHand";
import { useGetRound } from "../queries/useGetRound";
import { AnimatedCardPoints } from "../types/AnimatedCardPoints";
import AudioPlayer from "../components/AudioPlayer";

export const Game = () => {
  // state
  const [gameId, setGameId] = useState<number>(
    Number(localStorage.getItem(GAME_ID)) ?? 0
  );
  const [points, setPoints] = useState(0);
  const [multi, setMulti] = useState(0);
  const [cardPoints, setCardPoints] = useState<AnimatedCardPoints>({});
  const [preSelectionLocked, setPreSelectionLocked] = useState(false);
  const [discardAnimation, setDiscardAnimation] = useState(false);
  const [playAnimation, setPlayAnimation] = useState(false);
  const [gameLoading, setGameLoading] = useState(true);
  const [error, setError] = useState(false);
  const [preSelectedCards, setPreSelectedCards] = useState<number[]>([]);
  const [preSelectedPlay, setPreSelectedPlay] = useState<Plays>(Plays.NONE);

  // hooks
  const navigate = useNavigate();

  const { data: hand, refetch: refetchHand } = useGetCurrentHand(gameId);
  const { data: round, refetch: refetchRound } = useGetRound(gameId);

  const {
    setup: {
      systemCalls: { createGame, checkHand, discard, play },
      clientComponents: { Game, Round },
    },
    account,
  } = useDojo();

  // dojo variables
  const score = round?.score;
  const handsLeft = round?.hands;
  const discardsLeft = round?.discards;

  //effects
  useEffect(() => {
    if (!gameExists(Game, gameId)) {
      executeCreateGame();
    } else {
      setGameLoading(false);
      refetch();
      console.log("Game found, no need to create a new one");
    }
  }, []);

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

  // functions
  const refetch = () => {
    refetchHand();
    refetchRound().then((response) => {
      if (response.data?.roundModels?.edges?.[0]?.node?.hands === 0) {
        console.log("GAME OVER");
        setTimeout(() => {
          navigate("/gameover");
        }, 1000);
      }
    });
  };

  const resetMultiPoints = () => {
    setPoints(0);
    setMulti(0);
  };

  const executeCreateGame = () => {
    console.log("Creating game...");
    setGameLoading(true);
    createGame(account.account).then((newGameId) => {
      if (newGameId) {
        setGameId(newGameId);
        clearPreSelection();
        localStorage.setItem(GAME_ID, newGameId.toString());
        console.log(`game ${newGameId} created`);
        setTimeout(() => {
          setPreSelectionLocked(false);
          setGameLoading(false);
          refetch();
        }, 3000);
      } else {
        setError(true);
      }
    });
  };

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
    if (!preSelectionLocked && handsLeft > 0) {
      if (cardIsPreselected(cardIndex)) {
        unPreSelectCard(cardIndex);
      } else if (preSelectedCards.length < 5) {
        preSelectCard(cardIndex);
      }
    }
  };

  const clearPreSelection = () => {
    if (!preSelectionLocked && handsLeft > 0) {
      resetMultiPoints();
      setPreSelectedCards([]);
    }
  };

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

  const onPlayClick = () => {
    play(account.account, gameId, preSelectedCards).then((response) => {
      if (response) {
        setPreSelectionLocked(true);
        response.cards.forEach((card, index) => {
          setTimeout(() => {
            const { idx, points } = card;
            setCardPoints({ idx, points });
            setPoints((prev) => prev + points);
          }, 700 * index);
        });

        setTimeout(
          () => {
            setPlayAnimation(true);
          },
          700 * response.cards.length + 100
        );

        setTimeout(
          () => {
            setCardPoints({});
            setPlayAnimation(false);
            clearPreSelection();
            refetch();
            handsLeft > 0 && setPreSelectionLocked(false);
          },
          700 * response.cards.length + 400
        );
      }
    });
  };

  const onDiscardClick = () => {
    setPreSelectionLocked(true);
    discard(account.account, gameId, preSelectedCards).then((response) => {
      if (response) {
        setDiscardAnimation(true);
        setTimeout(() => {
          setPreSelectionLocked(false);
          clearPreSelection();
          refetch();
          setDiscardAnimation(false);
        }, 1500);
      }
    });
  };

  if (gameLoading) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Heading
          className="ui-text"
          sx={{ m: 10, fontSize: 60, textShadow: "0 0 20px #33effa" }}
        >
          Loading game...
        </Heading>
      </Box>
    );
  }
  if (error) {
    return <Heading sx={{ m: 10, fontSize: 30 }}>Error creating game</Heading>;
  }

  return (
    <Box
      sx={{
        height: "100%",
      }}
    >
      <AudioPlayer />
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
                SCORE: <RollingNumber n={score} />
              </Heading>
              <Heading className="ui-text" sx={{ fontSize: 25, mb: 2 }}>
                CURRENT PLAY: {PLAYS[preSelectedPlay]}
              </Heading>
              <MultiPoints multi={multi} points={points} />
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
                onClick={onPlayClick}
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
                            <AnimatedCard
                              points={
                                cardPoints.idx === idx ? cardPoints.points : 0
                              }
                              discarded={discardAnimation}
                              played={playAnimation}
                            >
                              <TiltCard
                                card={card}
                                onClick={() => {
                                  togglePreselected(idx);
                                }}
                              />
                            </AnimatedCard>
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
                onClick={onDiscardClick}
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
                  opacity: handsLeft > 0 ? 1 : 0.3,
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
              {handsLeft === 0 && (
                <Heading
                  className="ui-text"
                  sx={{ position: "fixed", bottom: "100px", fontSize: 30 }}
                >
                  you ran out of hands to play
                </Heading>
              )}
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
