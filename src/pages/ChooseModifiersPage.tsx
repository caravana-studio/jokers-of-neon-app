import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { Background } from "../components/Background";
import { useState } from "react";
import { Card } from "../types/Card";
import { TiltCard } from "../components/TiltCard";
import { FullScreenCardContainer } from "./FullScreenCardContainer";
import * as Modifiers from "../utils/mocks/modifiersMocks";
import { getCardUniqueId } from "../utils/getCardUniqueId";
import { BLUE, BLUE_LIGHT } from "../theme/colors";
import { useResponsiveValues } from "../theme/responsiveSettings";

export const ChooseModifiersPage = () => {
  const [cards, setCards] = useState<Card[]>(
    Object.values(Modifiers) as Card[]
  );
  const [cardsToKeep, setCardsToKeep] = useState<Card[]>([]);
  const { isSmallScreen, cardScale } = useResponsiveValues();
  const adjustedCardScale = cardScale * 1.2;
  const allSelected = cardsToKeep.length === cards.length;

  //const { selectCardsFromPack } = useStore();

  const confirmSelectCards = () => {
    //selectCardsFromPack(cardsToKeep.map((c) => c.idx));
    setCards([]);
    //navigate("/redirect/store");
  };

  return (
    <Background bgDecoration type="skulls">
      <Heading>- Modifier cards -</Heading>
      <Text>
        Modifier cards add unique effects to individual cards when played. Once
        added to your deck, they can be used whenever drawn, allowing for
        flexible and strategic play.
      </Text>
      <Heading>Choose up to 5</Heading>
      <FullScreenCardContainer>
        {cards.map((card, index) => {
          return (
            <Flex
              key={`${card.card_id ?? ""}-${index}`}
              flexDirection="column"
              gap={4}
            >
              <Box
                key={getCardUniqueId(card)}
                m={1.5}
                p={1}
                sx={{
                  borderRadius: { base: "7px", sm: "12px", md: "15px" },
                  opacity:
                    cardsToKeep.map((card) => card.idx).includes(card.idx) ||
                    cardsToKeep.length === 0
                      ? 1
                      : 0.5,
                  boxShadow: cardsToKeep
                    .map((card) => card.idx)
                    .includes(card.idx)
                    ? `0px 0px 15px 12px ${BLUE}`
                    : "none",
                  border: cardsToKeep.map((card) => card.idx).includes(card.idx)
                    ? `2px solid ${BLUE_LIGHT}`
                    : "2px solid transparent",
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
      <Button onClick={confirmSelectCards}>Continue</Button>
    </Background>
  );
};
