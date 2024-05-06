import {
  Box,
  Button,
  GridItem,
  Heading,
  Image,
  SimpleGrid,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { PLAYS } from "../constants/plays";
import { HandCard } from "../types/Card";
import { Plays } from "../types/Plays";
import { calculatePlay } from "../utils/calculatePlay";
import { getInitialDeck } from "../utils/getInitialDeck";

let deck = getInitialDeck();

export const Game = () => {
  const [hand, setHand] = useState<HandCard[]>([]);
  const [preSelectedPlay, setPreSelectedPlay] = useState<Plays>(Plays.NONE);
  const preSelectedCards = useMemo(
    () => hand?.filter((card) => card.preSelected) ?? [],
    [hand]
  );

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

  const preSelectCard = (cardIndex: number) => {
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
      >
        <Box sx={{ width: "100%", height: "100%" }}>
          <Box sx={{ height: "30%" }}></Box>
          <Box sx={{ height: "40%", mx: 35 }}>
            <SimpleGrid columns={5} gap={4}>
              <GridItem colSpan={4}>
                <SimpleGrid columns={5} gap={2}>
                  {hand
                    .filter((card) => card.preSelected)
                    .map((card, index) => {
                      return (
                        <GridItem key={card.img} w="100%">
                          <Image
                            key={card.img}
                            src={`Cards/${card.img}`}
                            alt={card.img}
                            width="100%"
                            sx={{
                              ":hover": {
                                transform: "scale(1.1) ",
                              },
                            }}
                            onClick={() => preSelectCard(index)}
                          />
                        </GridItem>
                      );
                    })}
                </SimpleGrid>
              </GridItem>
              <GridItem>
                <Box sx={{ width: "100%", display: "flex", flexDirection: 'column', gap: 4 }}>
                  <Heading>CURRENT PLAY: {PLAYS[preSelectedPlay]}</Heading>
                  <Button
                    className="fullWidth"
                    isDisabled={preSelectedCards?.length === 0}
                  >
                    play hand
                  </Button>
                  <Button
                    className="fullWidth"
                    isDisabled={preSelectedCards?.length === 0}
                  >
                    discard
                  </Button>
                </Box>
              </GridItem>
            </SimpleGrid>
          </Box>
          <Box sx={{ height: " 30%" }}>
            <SimpleGrid columns={8}>
              {hand
                .filter((card) => !card.preSelected)
                .map((card, index) => {
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
                        onClick={() => preSelectCard(index)}
                      />
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
