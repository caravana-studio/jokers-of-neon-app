import { Box, Button, Checkbox, Flex, Text, Tooltip } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { BackgroundDecoration } from "../components/Background";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { PositionedDiscordLink } from "../components/DiscordLink";
import { PositionedGameMenu } from "../components/GameMenu";
import { Loading } from "../components/Loading";
import { TiltCard } from "../components/TiltCard";
import { useBlisterPackResult } from "../dojo/queries/useBlisterPackResult";
import { useCurrentSpecialCards } from "../dojo/queries/useCurrentSpecialCards";
import { useGame } from "../dojo/queries/useGame";
import { useStore } from "../providers/StoreProvider";
import { BLUE, BLUE_LIGHT } from "../theme/colors";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { Card } from "../types/Card";
import { getCardUniqueId } from "../utils/getCardUniqueId";
import { FullScreenCardContainer } from "./FullScreenCardContainer";

export const OpenLootBox = () => {
  const navigate = useNavigate();

  const game = useGame();
  const maxSpecialCards = game?.special_slots ?? 0;

  const blisterPackResult = useBlisterPackResult();
  const [cards, setCards] = useState<Card[]>([]);
  const [cardsToKeep, setCardsToKeep] = useState<Card[]>([]);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const currentSpecialCards = useCurrentSpecialCards();
  const currentSpecialCardsLenght = currentSpecialCards?.length ?? 0;
  const specialCardsToKeep = cardsToKeep.filter((c) => c.isSpecial).length;
  const continueDisabled =
    specialCardsToKeep > maxSpecialCards - currentSpecialCardsLenght;
  const { t } = useTranslation(["store"]);
  const { isSmallScreen, cardScale } = useResponsiveValues();
  const adjustedCardScale = cardScale * 1.2;

  useEffect(() => {
    let timeoutId: any;
    
    if (game?.state === "AT_SHOP") {
      timeoutId = setTimeout(() => {
        if (game?.state === "AT_SHOP") {
          navigate("/redirect/store", { state: { lastTabIndex: 1 } });
        }
      }, 3000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [game?.state, navigate]);

  useEffect(() => {
    if (blisterPackResult?.cardsPicked) {
      setCards([]);
    } else {
      setCards(blisterPackResult?.cards ?? []);
      setCardsToKeep(blisterPackResult?.cards ?? []);
    }
  }, [blisterPackResult]);

  const allSelected = cardsToKeep.length === cards.length;

  const { selectCardsFromPack } = useStore();

  const confirmSelectCards = () => {
    selectCardsFromPack(cardsToKeep.map((c) => c.idx));
    setCards([]);
    navigate("/redirect/store", { state: { lastTabIndex: 1 } });
  };

  const continueButton = (
    <Button
      mx={{ base: 6, md: 0 }}
      fontSize={12}
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
      {t("store.packs.continue-btn")}
    </Button>
  );

  return (
    <BackgroundDecoration>
      <PositionedGameMenu decoratedPage />
      {cards.length > 0 ? (
        <Flex
          height={"100%"}
          justifyContent="center"
          flexDirection="column"
          gap={4}
        >
          <Flex
            flexDirection={isSmallScreen ? "column" : "row"}
            justifyContent="space-between"
            alignItems="center"
            mx={2}
          >
            <Text size="lg">{t("store.packs.cards-select-lbl")}</Text>
            <Checkbox
              color="white"
              isChecked={!!allSelected}
              onChange={(e) => {
                !e.target.checked ? setCardsToKeep([]) : setCardsToKeep(cards);
              }}
            >
              {t("store.packs.select-all-lbl").toUpperCase()}
            </Checkbox>
          </Flex>
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
                    zIndex={1}
                    sx={{
                      borderRadius: { base: "7px", sm: "12px", md: "15px" },
                      opacity:
                        cardsToKeep
                          .map((card) => card.idx)
                          .includes(card.idx) || cardsToKeep.length === 0
                          ? 1
                          : 0.5,
                      boxShadow: cardsToKeep
                        .map((card) => card.idx)
                        .includes(card.idx)
                        ? `0px 0px 15px 12px ${BLUE}`
                        : "none",
                      border: cardsToKeep
                        .map((card) => card.idx)
                        .includes(card.idx)
                        ? `2px solid ${BLUE_LIGHT}`
                        : "2px solid transparent",
                    }}
                    cursor={"pointer"}
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
          <Flex
            flexDirection={isSmallScreen ? "column" : "row"}
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
                  navigate("/manage");
                }}
              >
                {t("store.packs.special-cards-btn")}
              </Button>
            ) : (
              <Box />
            )}
            {continueDisabled ? (
              <Tooltip label={t("store.packs.error-lbl")}>
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
      {confirmationModalOpen && (
        <ConfirmationModal
          close={() => setConfirmationModalOpen(false)}
          title={t("store.packs.confirmation-modal.head")}
          description={t("store.packs.confirmation-modal.description")}
          onConfirm={confirmSelectCards}
        />
      )}
      {!isSmallScreen && <PositionedDiscordLink />}
    </BackgroundDecoration>
  );
};
