import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { Background } from "../components/Background";
import { useState } from "react";
import { Card } from "../types/Card";
import { TiltCard } from "../components/TiltCard";
import { FullScreenCardContainer } from "./FullScreenCardContainer";
import * as Specials from "../utils/mocks/specialCardMocks";
import { getCardUniqueId } from "../utils/getCardUniqueId";
import { LS_GREEN } from "../theme/colors";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { Collab } from "./Game/collab";

export const ChooseSpecialsPage = () => {
  const [cards, setCards] = useState<Card[]>(Object.values(Specials) as Card[]);
  const [cardsToKeep, setCardsToKeep] = useState<Card[]>([]);
  const { isSmallScreen, cardScale } = useResponsiveValues();
  const adjustedCardScale = cardScale * 1.5;
  const allSelected = cardsToKeep.length === cards.length;

  //const { selectCardsFromPack } = useStore();

  const confirmSelectCards = () => {
    //selectCardsFromPack(cardsToKeep.map((c) => c.idx));
    setCards([]);
    //navigate("/redirect/store");
  };

  return (
    <Background bgDecoration type="skulls">
      <Heading size={"xxl"} textAlign={"center"} variant="neonGreen">
        - Special cards -
      </Heading>
      <Text
        size={"l"}
        width={isSmallScreen ? "100%" : "70%"}
        margin={"0 auto"}
        textAlign={"center"}
        lineHeight={1}
      >
        Special cards are the most powerful cards in the game, providing unique
        special effects that help maximize your score. Once unlocked, these
        effects remain active throughout the game, enhancing your strategy as
        you progress.
      </Text>
      <Heading size={"xl"} textAlign={"center"} variant="neonGreen" my={4}>
        Choose up to 2
      </Heading>
      <FullScreenCardContainer
        sx={{ width: isSmallScreen ? "100%" : "80%", margin: "0 auto" }}
      >
        {cards.map((card, index) => {
          return (
            <Flex
              key={`${card.card_id ?? ""}-${index}`}
              flexDirection="column"
              gap={2}
            >
              <Box
                key={getCardUniqueId(card)}
                m={1}
                padding={"8px"}
                sx={{
                  opacity:
                    cardsToKeep.map((card) => card.idx).includes(card.idx) ||
                    cardsToKeep.length === 0
                      ? 1
                      : 0.9,
                  boxShadow: cardsToKeep
                    .map((card) => card.idx)
                    .includes(card.idx)
                    ? `0px 0px 15px 1px ${LS_GREEN}, inset 0px 0px 15px 1px ${LS_GREEN}`
                    : "none",
                  border: cardsToKeep.map((card) => card.idx).includes(card.idx)
                    ? `1px solid ${LS_GREEN}`
                    : "1px solid transparent",
                }}
              >
                <TiltCard
                  scale={adjustedCardScale}
                  card={card}
                  key={index}
                  onClick={() => {
                    if (
                      cardsToKeep.map((card) => card.idx).includes(card.idx)
                    ) {
                      setCardsToKeep(
                        cardsToKeep.filter((c) => c.idx !== card.idx)
                      );
                    } else {
                      setCardsToKeep([...cardsToKeep, card]);
                    }
                  }}
                />
              </Box>
            </Flex>
          );
        })}
      </FullScreenCardContainer>
      <Flex justifyContent={"center"} my={4}>
        <Button onClick={confirmSelectCards}>Continue</Button>
      </Flex>
      {!isSmallScreen && (
        <Box position={"fixed"} left={8} top={12}>
          <Collab />
        </Box>
      )}
    </Background>
  );
};
