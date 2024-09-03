import { Box, Button, Checkbox, Flex, Text, Tooltip } from "@chakra-ui/react";
import { PropsWithChildren, useState } from "react";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { Background } from "../components/Background";
import { CurrentSpecialCardsModal } from "../components/CurrentSpecialCardsModal";
import { TiltCard } from "../components/TiltCard";
import { CARD_HEIGHT, CARD_WIDTH } from "../constants/visualProps";
import { useBlisterPackResult } from "../dojo/queries/useBlisterPackResult";
import { useCurrentSpecialCards } from "../dojo/queries/useCurrentSpecialCards";
import { useGame } from "../dojo/queries/useGame";
import { useStore } from "../providers/StoreProvider";
import { BLUE } from "../theme/colors";
import { Card } from "../types/Card";
import { getCardUniqueId } from "../utils/getCardUniqueId";

export const OpenPack = () => {
  const navigate = useNavigate();

  const game = useGame();
  const maxSpecialCards = game?.len_max_current_special_cards ?? 0;

  const blisterPackResult = useBlisterPackResult();
  const [cardsToKeep, setCardsToKeep] = useState<Card[]>([]);
  const [cards, setCards] = useState<Card[]>(blisterPackResult);
  const currentSpecialCards = useCurrentSpecialCards();
  const currentSpecialCardsLenght = currentSpecialCards?.length ?? 0;
  const specialCardsToKeep = cardsToKeep.filter((c) => c.isSpecial).length;
  const continueDisabled =
    specialCardsToKeep > maxSpecialCards - currentSpecialCardsLenght;

  const allSelected = cardsToKeep.length === cards.length;

  const [specialCardsModalOpen, setSpecialCardsModalOpen] = useState(false);

  const { selectCardsFromPack } = useStore();

  const continueButton = (
    <Button
      mx={{ base: 6, md: 0 }}
      isDisabled={continueDisabled}
      variant={continueDisabled ? "defaultOutline" : "solid"}
      onClick={async () => {
        const response = await selectCardsFromPack(cardsToKeep.map((c) => c.idx));
        console.log("response", response);
      }}
    >
      Continue
    </Button>
  );

  return (
    <Background type="game" dark rewardsDecoration>
      <Flex flexDirection="column" gap={4}>
        <Flex
          flexDirection={isMobile ? "column" : "row"}
          justifyContent="space-between"
          alignItems="center"
          mx={2}
        >
          <Text size="lg">Select the cards you want to keep</Text>
          <Checkbox
            color="white"
            isChecked={!!allSelected}
            onChange={(e) => {
              !e.target.checked ? setCardsToKeep([]) : setCardsToKeep(cards);
            }}
          >
            SELECT ALL
          </Checkbox>
        </Flex>
        <CardsContainer>
          {cards.map((card, index) => {
            return (
              <Flex key={card.card_id} flexDirection="column" gap={4}>
                <Box
                  key={getCardUniqueId(card)}
                  p={1.5}
                  sx={{
                    borderRadius: { base: "7px", md: "15px" },
                    opacity:
                      cardsToKeep.includes(card) || cardsToKeep.length === 0
                        ? 1
                        : 0.5,
                    boxShadow: cardsToKeep.includes(card)
                      ? {
                          base: `0px 0px 10px 5px ${BLUE}`,
                          md: `0px 0px 20px 12px ${BLUE}`,
                        }
                      : "none",
                  }}
                >
                  <TiltCard
                    scale={1.2}
                    card={card}
                    key={index}
                    onClick={() => {
                      if (cardsToKeep.includes(card)) {
                        setCardsToKeep(cardsToKeep.filter((c) => c !== card));
                      } else {
                        setCardsToKeep([...cardsToKeep, card]);
                      }
                    }}
                  />
                </Box>
              </Flex>
            );
          })}
        </CardsContainer>
        <Flex
          flexDirection={isMobile ? "column" : "row"}
          justifyContent="space-between"
          mt={4}
          gap={4}
        >
          {currentSpecialCardsLenght > 0 ? (
            <Button
              variant="outline"
              fontSize={12}
              mx={{ base: 6, md: 0 }}
              onClick={() => {
                setSpecialCardsModalOpen(true);
              }}
            >
              See my current special cards
            </Button>
          ) : (
            <Box />
          )}
          {continueDisabled ? (
            <Tooltip label="You can't continue because you have more special cards than the maximum allowed">
              {continueButton}
            </Tooltip>
          ) : (
            continueButton
          )}
        </Flex>
      </Flex>
      {specialCardsModalOpen && (
        <CurrentSpecialCardsModal
          close={() => setSpecialCardsModalOpen(false)}
        />
      )}
    </Background>
  );
};

const CardsContainer = ({ children }: PropsWithChildren) => {
  return isMobile ? (
    <Box
      sx={{
        maxWidth: `${CARD_WIDTH * 5}px`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        minHeight: `${CARD_HEIGHT * 2 + 30}px`,
      }}
    >
      {children}
    </Box>
  ) : (
    <Flex gap={3}>{children}</Flex>
  );
};
