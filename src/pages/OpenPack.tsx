import { Box, Button, Checkbox, Flex, Text, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Background } from "../components/Background";
import { CurrentSpecialCardsModal } from "../components/CurrentSpecialCardsModal";
import { TiltCard } from "../components/TiltCard";
import { useCurrentSpecialCards } from "../dojo/queries/useCurrentSpecialCards";
import { useGame } from "../dojo/queries/useGame";
import { BLUE } from "../theme/colors";
import { Card } from "../types/Card";
import { getCardUniqueId } from "../utils/getCardUniqueId";
import { C2, HQ, JOKER1, JOKER2, S10 } from "../utils/mocks/cardMocks";
import { EasyFlush } from "../utils/mocks/specialCardMocks";

const mockedCards = [C2, JOKER1, HQ, JOKER2, EasyFlush, S10];

export const OpenPack = () => {
  const navigate = useNavigate();

  const game = useGame();
  const maxSpecialCards = game?.len_max_current_special_cards ?? 0;

  const [cardsToKeep, setCardsToKeep] = useState<Card[]>([]);
  const [cards, setCards] = useState<Card[]>(mockedCards);
  const currentSpecialCards = useCurrentSpecialCards();
  const currentSpecialCardsLenght = currentSpecialCards?.length ?? 0;
  const specialCardsToKeep = cardsToKeep.filter((c) => c.isSpecial).length;
  const continueDisabled =
    specialCardsToKeep > maxSpecialCards - currentSpecialCardsLenght;

  const allSelected = cardsToKeep.length === cards.length;

  const [specialCardsModalOpen, setSpecialCardsModalOpen] = useState(false);

  const continueButton = (
    <Button
      isDisabled={continueDisabled}
      variant={continueDisabled ? "defaultOutline" : "solid"}
    >
      Continue
    </Button>
  );

  return (
    <Background type="game" dark rewardsDecoration>
      <Flex flexDirection="column" gap={4}>
        <Flex justifyContent="space-between" mx={2}>
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
        <Flex gap={3}>
          {cards.map((card, index) => {
            return (
              <Flex flexDirection="column" gap={4}>
                <Box
                  key={getCardUniqueId(card)}
                  p={1.5}
                  sx={{
                    borderRadius: "15px",
                    opacity:
                      cardsToKeep.includes(card) || cardsToKeep.length === 0
                        ? 1
                        : 0.5,
                    boxShadow: cardsToKeep.includes(card)
                      ? `0px 0px 20px 12px ${BLUE}`
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
        </Flex>
        <Flex justifyContent="space-between" mt={4}>
          {currentSpecialCardsLenght > 0 ? (
            <Button
              variant="outline"
              fontSize={12}
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
