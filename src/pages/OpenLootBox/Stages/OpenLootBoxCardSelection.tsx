import { Box, Checkbox, Flex, Text, Tooltip } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { BackgroundDecoration } from "../../../components/Background";
import { ConfirmationModal } from "../../../components/ConfirmationModal";
import { DelayedLoading } from "../../../components/DelayedLoading";
import { Loading } from "../../../components/Loading";
import {
  BarButton,
  MobileBottomBar,
} from "../../../components/MobileBottomBar";
import { MobileDecoration } from "../../../components/MobileDecoration";
import { useDojo } from "../../../dojo/DojoContext";
import { GameStateEnum } from "../../../dojo/typescript/custom";
import { useCardsFlipAnimation } from "../../../hooks/useCardsFlipAnimation";
import { useCustomNavigate } from "../../../hooks/useCustomNavigate";
import { useCustomToast } from "../../../hooks/useCustomToast";
import { useStore } from "../../../providers/StoreProvider";
import { useGameStore } from "../../../state/useGameStore";
import { useLootBoxStore } from "../../../state/useLootBoxStore";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import { FlipCardGrid } from "../FlipCardGrid";
import { ManageSpecialCardsButton } from "../ManageSpecialCardsButton";
import { CardTypes } from "../../../enums/cardTypes";
import { useCardData } from "../../../providers/CardDataProvider";

export const OpenLootBoxCardSelection = () => {
  const {
    setup: { client },
  } = useDojo();
  const customNavigate = useCustomNavigate();
  const navigate = useNavigate();
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const {
    fetchLootBoxResult,
    result: cards,
    cardsToKeep,
    toggleCard,
    reset,
    selectAll,
    selectNone,
  } = useLootBoxStore();
  const { getCardData } = useCardData();
  const {
    id: gameId,
    specialSlots,
    specialCards: currentSpecialCards,
  } = useGameStore();
  const specialCardsToKeep = cardsToKeep.filter(
    (c) => c.type === CardTypes.SPECIAL
  ).length;
  const maxSpecialCards = specialSlots ?? 0;
  const currentSpecialCardsLength = currentSpecialCards?.length ?? 0;

  useEffect(() => {
    fetchLootBoxResult(client, gameId, getCardData);
  }, []);
  const { selectCardsFromPack } = useStore();
  const { showErrorToast } = useCustomToast();

  const confirmSelectCards = () => {
    selectCardsFromPack(cardsToKeep.map((c) => c.idx))
      .then((response) => {
        if (response) {
          reset();
        } else {
          showErrorToast("Error selecting cards");
          customNavigate(GameStateEnum.Lootbox);
        }
      })
      .catch(() => {
        showErrorToast("Error selecting cards");
        customNavigate(GameStateEnum.Lootbox);
      });
    customNavigate(GameStateEnum.Store);
  };

  const { flippedStates, animationRunning, skipFlipping } =
    useCardsFlipAnimation(cards.length, 1000);

  const specialCardCount = cards.filter(
    (card) => card.type === CardTypes.SPECIAL
  ).length;

  const { t } = useTranslation(["store"]);
  const { isSmallScreen } = useResponsiveValues();

  const chooseDisabled =
    specialCardsToKeep > maxSpecialCards - currentSpecialCardsLength;
  const allSelected = cardsToKeep.length === cards.length;

  const onContinueClick = () => {
    if (cardsToKeep.length === 0) {
      setConfirmationModalOpen(true);
    } else {
      confirmSelectCards();
    }
  };

  const continueButton = (
    <BarButton
      mx={{ base: 6, md: 0 }}
      width={"auto"}
      fontSize={12}
      disabled={chooseDisabled}
      variant={chooseDisabled ? "defaultOutline" : "solid"}
      opacity={animationRunning ? 0 : 1}
      transition="opacity 0.3s ease"
      label={t("store.packs.continue-btn")}
      onClick={onContinueClick}
    />
  );

  const renderContinueButton = () => {
    if (chooseDisabled) {
      if (isSmallScreen) {
        return (
          <Flex w="100%" justifyContent="center" alignItems="center">
            <Text textAlign="center" w="60%" size="lg" zIndex={2}>
              {t("store.packs.error-lbl")}
            </Text>
          </Flex>
        );
      }

      return (
        <Tooltip label={t("store.packs.error-lbl")} zIndex={10}>
          <Box display="inline-block">{continueButton}</Box>
        </Tooltip>
      );
    }

    return !isSmallScreen ? continueButton : null;
  };

  return (
    <DelayedLoading ms={50}>
      {isSmallScreen && <MobileDecoration />}
      <BackgroundDecoration contentHeight={isSmallScreen ? "85%" : "60%"}>
        {cards.length > 0 ? (
          <Flex
            height={"100%"}
            width={isSmallScreen ? "100%" : "auto"}
            justifyContent={isSmallScreen ? "space-between" : "center"}
            flexDirection="column"
            gap={4}
          >
            <Flex
              flexDirection={"column"}
              gap={4}
              justifyContent={"center"}
              height={isSmallScreen ? "100%" : "auto"}
            >
              <Flex
                flexDirection={isSmallScreen ? "column" : "row"}
                justifyContent="space-between"
                alignItems="center"
                mx={2}
                opacity={animationRunning ? 0 : 1}
                transition="opacity 0.3s ease"
                gap={isSmallScreen ? 2 : 8}
              >
                <Text size="lg">{t("store.packs.cards-select-lbl")}</Text>
                <Checkbox
                  color="white"
                  isChecked={!!allSelected}
                  onChange={(e) => {
                    !e.target.checked ? selectNone() : selectAll();
                  }}
                >
                  {t("store.packs.select-all-lbl").toUpperCase()}
                </Checkbox>
              </Flex>
              <FlipCardGrid
                cards={cards}
                cardsToKeep={cardsToKeep}
                flippedStates={flippedStates}
                animationRunning={animationRunning}
                onCardToggle={toggleCard}
                onGridClick={skipFlipping}
              />
            </Flex>
            <Flex
              flexDirection={isSmallScreen ? "column" : "row"}
              justifyContent="space-between"
              mt={4}
              gap={4}
            >
              {specialCardCount > 0 && !isSmallScreen ? (
                <ManageSpecialCardsButton opacity={animationRunning ? 0 : 1} />
              ) : (
                <Box />
              )}

              {renderContinueButton()}
            </Flex>
            {isSmallScreen && (
              <MobileBottomBar
                firstButton={
                  specialCardCount > 0 && !animationRunning
                    ? {
                        onClick: () => {
                          navigate("/manage", { state: { returnToLootBox: true } });
                        },
                        label: t("store.packs.special-cards-btn"),
                      }
                    : undefined
                }
                secondButton={
                  !animationRunning
                    ? {
                        onClick: onContinueClick,
                        disabled: chooseDisabled,
                        label: t("store.packs.continue-btn"),
                      }
                    : undefined
                }
              />
            )}

            {confirmationModalOpen && (
              <ConfirmationModal
                close={() => setConfirmationModalOpen(false)}
                title={t("store.packs.confirmation-modal.head")}
                description={t("store.packs.confirmation-modal.description")}
                onConfirm={confirmSelectCards}
              />
            )}
          </Flex>
        ) : (
          <Loading />
        )}
      </BackgroundDecoration>
    </DelayedLoading>
  );
};
