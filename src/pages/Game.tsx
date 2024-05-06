import {
  Box,
  Button,
  GridItem,
  Heading,
  Image,
  SimpleGrid,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { TiltCard } from "../components/TiltCard";
import { PLAYS } from "../constants/plays";
import { HandCard } from "../types/Card";
import { Plays } from "../types/Plays";
import { calculatePlay } from "../utils/calculatePlay";
import { getInitialDeck } from "../utils/getInitialDeck";

let deck = getInitialDeck();

export const Game = () => {
  const [hand, setHand] = useState<HandCard[]>([]);
  const [preSelectedCards, setPreSelectedCards] = useState<HandCard[]>([]);
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

  const unPreSelectCard = (img: string) => {
    setPreSelectedCards(preSelectedCards.filter((card) => card.img !== img));
    togglePreselected(hand.findIndex((card) => card.img === img));
  };

  useEffect(() => {
    setPreSelectedPlay(calculatePlay(preSelectedCards));
  }, [preSelectedCards]);

  useEffect(() => {
    Array.from(Array(8)).forEach(() => {
      drawCard();
    });
  }, []);

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
          <Box sx={{ height: "40%", mx: 35 }}>
            <SimpleGrid columns={5} gap={4}>
              <GridItem colSpan={4}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  {preSelectedCards.map((card, index) => {
                    return (
                      <Box key={card.img} sx={{ width: "20%", px: 2 }}>
                        <TiltCard>
                          <Image
                            key={card.img}
                            src={`Cards/${card.img}`}
                            alt={card.img}
                            width="100%"
                            onClick={(e) => {
                              e.stopPropagation();
                              unPreSelectCard(card.img);
                            }}
                          />
                        </TiltCard>
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
          <Box sx={{ display: "flex", height: " 30%", alignItems: "flex-end" }}>
            <SimpleGrid sx={{ width: "100%" }} columns={8}>
              {hand.map((card, index) => {
                return (
                  <GridItem
                    key={card.img}
                    w="100%"
                    sx={{
                      transform: `scale(1.1) rotate(${
                        (index - 3.5) * 2
                      }deg) translateY(${Math.abs(index - 3.5) * 15}px)`,
                    }}
                  >
                    {!card.preSelected && (
                      <TiltCard>
                        <Image
                          key={card.img}
                          sx={{
                            ":hover": {
                              transform: "translateY(-30px) ",
                            },
                          }}
                          src={`Cards/${card.img}`}
                          alt={card.img}
                          width="100%"
                          onClick={(e) => {
                            e.stopPropagation();
                            preSelectCard(index);
                          }}
                        />
                      </TiltCard>
                    )}
                  </GridItem>
                );
              })}
            </SimpleGrid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
