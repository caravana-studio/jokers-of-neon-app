import { Box, Button, Checkbox, Flex, Text, Tooltip } from "@chakra-ui/react";
import { PropsWithChildren, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { Background } from "../components/Background";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { CurrentSpecialCardsModal } from "../components/CurrentSpecialCardsModal";
import { Loading } from "../components/Loading";
import { TiltCard } from "../components/TiltCard";
import { CARD_HEIGHT, CARD_WIDTH } from "../constants/visualProps";
import { useStore } from "../providers/StoreProvider";
import { BLUE } from "../theme/colors";
import { Card } from "../types/Card";
import { getCardUniqueId } from "../utils/getCardUniqueId";

import styled from "styled-components";
import { useBlisterPackResult } from "../dojo/queries/useBlisterPackResult";
import { useCurrentSpecialCards } from "../dojo/queries/useCurrentSpecialCards";
import { useGame } from "../dojo/queries/useGame";
import { PositionedDiscordLink } from "../components/DiscordLink";

/* const WhiteOverlay = styled.div<{ $visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: white;
  z-index: 9999;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: opacity 1s ease-out;
  pointer-events: none;
`; */


export const OpenPack = () => {
/*   const [overlayVisible, setOverlayVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOverlayVisible(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []); */
  const navigate = useNavigate();

  const game = useGame();
  const maxSpecialCards = game?.len_max_current_special_cards ?? 0;

  const blisterPackResult = useBlisterPackResult();
  const [cards, setCards] = useState<Card[]>([]);
  const [cardsToKeep, setCardsToKeep] = useState<Card[]>([]);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const currentSpecialCards = useCurrentSpecialCards();
  const currentSpecialCardsLenght = currentSpecialCards?.length ?? 0;
  const specialCardsToKeep = cardsToKeep.filter((c) => c.isSpecial).length;
  const continueDisabled =
    specialCardsToKeep > maxSpecialCards - currentSpecialCardsLenght;

  useEffect(() => {
    if (game?.state === "IN_STORE") {
      navigate("/redirect/store");
    }
  }, [game?.state]);

  useEffect(() => {
    if (blisterPackResult?.cardsPicked) {
      setCards([]);
    } else {
      setCards(blisterPackResult?.cards ?? []);
      setCardsToKeep(blisterPackResult?.cards ?? []);
    }
  }, [blisterPackResult]);

  const allSelected = cardsToKeep.length === cards.length;

  const [specialCardsModalOpen, setSpecialCardsModalOpen] = useState(false);

  const { selectCardsFromPack } = useStore();

  const confirmSelectCards = () => {
    selectCardsFromPack(cardsToKeep.map((c) => c.idx));
    setCards([]);
    navigate("/redirect/store");
  };

  const continueButton = (
    <Button
      mx={{ base: 6, md: 0 }}
      isDisabled={continueDisabled}
      variant={continueDisabled ? "defaultOutline" : "solid"}
      onClick={() => {
        if (cardsToKeep.length === 0) {
          setConfirmationModalOpen(true);
        } else {
          confirmSelectCards();
        }
      }}
    >
      Continue
    </Button>
  );

  return (
    <Background type="game" dark bgDecoration>
      {/* <WhiteOverlay $visible={overlayVisible} /> */}
      {cards.length > 0 ? (
        <Flex
          height={"100%"}
          justifyContent="center"
          flexDirection="column"
          gap={4}
        >
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
                <Flex
                  key={`${card.card_id ?? ""}-${index}`}
                  flexDirection="column"
                  gap={4}
                >
                  <Box
                    key={getCardUniqueId(card)}
                    m={1.5}
                    p={{ base: 1, sm: 1.5 }}
                    sx={{
                      borderRadius: { base: "7px", md: "15px" },
                      opacity:
                        cardsToKeep
                          .map((card) => card.idx)
                          .includes(card.idx) || cardsToKeep.length === 0
                          ? 1
                          : 0.5,
                      boxShadow: cardsToKeep
                        .map((card) => card.idx)
                        .includes(card.idx)
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
      ) : (
        <Loading />
      )}
      {specialCardsModalOpen && (
        <CurrentSpecialCardsModal
          close={() => setSpecialCardsModalOpen(false)}
        />
      )}
      {confirmationModalOpen && (
        <ConfirmationModal
          close={() => setConfirmationModalOpen(false)}
          title="No cards selected"
          description="You have selected no cards. Are you sure you want to continue?"
          onConfirm={confirmSelectCards}
        />
      )}
      {!isMobile && <PositionedDiscordLink />}
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
        minHeight: `${CARD_HEIGHT * 2 + 80}px`,
      }}
    >
      {children}
    </Box>
  ) : (
    <Flex gap={3}>{children}</Flex>
  );
};
