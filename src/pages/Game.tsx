import { Box, GridItem, Heading, Image, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/Button";
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
        animation:
          "5s ease 20000ms normal none infinite running glitch",
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
        <Box sx={{ width: "100%", height: "calc(100% - 60px)" }}>
          <Box sx={{ height: "10%" }}>
            <Heading sx={{ textAlign: "right" }}>
              CURRENT PLAY: {PLAYS[preSelectedPlay]}
            </Heading>
          </Box>{" "}
          <Box sx={{ height: "45%" }}></Box>
          <Box sx={{ height: "45%" }}>
            <SimpleGrid columns={8} spacing={4}>
              {hand.map((card, index) => {
                return (
                  <GridItem key={card.img} w="100%">
                    <Image
                      key={card.img}
                      sx={{
                        transform: card.preSelected
                          ? "translateY(-30px)"
                          : "none",
                        ":hover": {
                          transform: card.preSelected
                            ? "translateY(-30px) scale(1.1)"
                            : "scale(1.1)",
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

        <SimpleGrid columns={2} spacing={4}>
          <GridItem h="60px" w="100%">
            <Button isDisabled={preSelectedCards?.length === 0}>
              play hand
            </Button>
          </GridItem>
          <GridItem h="60px" w="100%">
            <Button isDisabled={preSelectedCards?.length === 0}>discard</Button>
          </GridItem>
        </SimpleGrid>
      </Box>
    </Box>
  );
};
